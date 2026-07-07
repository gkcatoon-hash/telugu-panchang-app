import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

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
};

const LocationContext = createContext<Ctx | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<Location>(PRESET_CITIES[0]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.lat && parsed?.lon && parsed?.name) setLocationState(parsed);
        }
      } catch {}
    })();
  }, []);

  const setLocation = useCallback((l: Location) => {
    setLocationState(l);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(l)).catch(() => {});
  }, []);

  const value = useMemo(() => ({ location, setLocation }), [location, setLocation]);
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside LocationProvider");
  return ctx;
}
