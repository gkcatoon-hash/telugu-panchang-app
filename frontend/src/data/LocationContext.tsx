import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoLocation from "expo-location";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { scheduleDailyPanchangNotification } from "@/src/notifications/notifications";

export type Location = {
  name: string;
  lat: number;
  lon: number;
  tz: string; // display only
};

export const PRESET_CITIES: Location[] = [
  { name: "Hyderabad", lat: 17.385, lon: 78.4867, tz: "Asia/Kolkata" },
  { name: "Vijayawada", lat: 16.5062, lon: 80.648, tz: "Asia/Kolkata" },
  { name: "Visakhapatnam", lat: 17.6868, lon: 83.2185, tz: "Asia/Kolkata" },
  { name: "Tirupati", lat: 13.6288, lon: 79.4192, tz: "Asia/Kolkata" },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946, tz: "Asia/Kolkata" },
  { name: "Chennai", lat: 13.0827, lon: 80.2707, tz: "Asia/Kolkata" },
  { name: "Mumbai", lat: 19.076, lon: 72.8777, tz: "Asia/Kolkata" },
  { name: "Delhi", lat: 28.6139, lon: 77.209, tz: "Asia/Kolkata" },
];

const STORAGE_KEY = "@manalife/location";

type Ctx = {
  location: Location;
  setLocation: (l: Location) => void;
  refreshLocation: () => Promise<void>;
  isDetecting: boolean;
  error: string | null;
};

const LocationContext = createContext<Ctx | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<Location>(PRESET_CITIES[0]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyLocation = useCallback((next: Location) => {
    setLocationState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
    scheduleDailyPanchangNotification(next.lat, next.lon, next.tz).catch(() => {});
  }, []);

  const refreshLocation = useCallback(async () => {
    setIsDetecting(true);
    setError(null);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.lat && parsed?.lon && parsed?.name) {
          applyLocation(parsed);
          setIsDetecting(false);
          return;
        }
      }

      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission not granted.");
        return;
      }

      const pos = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Low });
      const rev = await ExpoLocation.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      const place = rev && rev.length > 0 ? rev[0] : null;
      const name = place?.city || place?.region || "Current Location";
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
      const detected = {
        name,
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        tz,
      } satisfies Location;
      applyLocation(detected);
    } catch {
      setError("Unable to detect your location right now.");
    } finally {
      setIsDetecting(false);
    }
  }, [applyLocation]);

  useEffect(() => {
    refreshLocation().catch(() => {});
  }, [refreshLocation]);

  const setLocation = useCallback((l: Location) => {
    applyLocation(l);
  }, [applyLocation]);

  const value = useMemo(() => ({ location, setLocation, refreshLocation, isDetecting, error }), [location, setLocation, refreshLocation, isDetecting, error]);
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside LocationProvider");
  return ctx;
}
