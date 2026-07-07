// Icon font loader for Expo apps. Fonts are loaded from a LOCAL bundled
// asset only under Expo Go (StoreClient) — that's where @expo/vector-icons'
// .ttf files come back as 0 bytes from Metro's asset resolver on Android.
// Native dev/prod builds and web pass an empty map, so useFonts resolves to
// [true, null] immediately via react-native-vector-icons autolinking / web
// stubs.
//
// We only use Ionicons across the app; only that family is registered here.
// Font is bundled locally (assets/fonts/Ionicons.ttf) — no CDN dependency,
// no supply-chain / integrity concerns.
//
// Usage: const [loaded, error] = useIconFonts();

import Constants, { ExecutionEnvironment } from "expo-constants";
import { useFonts } from "expo-font";

// short internal fontName (what @expo/vector-icons queries) -> local .ttf
const ICON_FAMILIES = {
  ionicons: require("../../assets/fonts/Ionicons.ttf"),
} as const;

const iconFontMap = (): Record<string, any> => ({ ...ICON_FAMILIES });

export const useIconFonts = (): readonly [boolean, Error | null] =>
  useFonts(
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient
      ? iconFontMap()
      : {},
  );
