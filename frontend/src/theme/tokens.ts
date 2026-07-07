import { Platform } from "react-native";

export const lightColors = {
  surface: "#F6F8FA",
  onSurface: "#0A1128",
  surfaceSecondary: "#FFFFFF",
  onSurfaceSecondary: "#151F38",
  surfaceTertiary: "#EAEFF5",
  onSurfaceTertiary: "#293A60",
  surfaceInverse: "#0A1128",
  onSurfaceInverse: "#FDF1D6",
  brand: "#D4AF37",
  brandPrimary: "#D4AF37",
  onBrandPrimary: "#0A1128",
  brandSecondary: "#B8860B",
  onBrandSecondary: "#FFFFFF",
  brandTertiary: "#FDF1D6",
  onBrandTertiary: "#8B6508",
  success: "#2D6A4F",
  warning: "#B08D57",
  error: "#9B2226",
  info: "#005F73",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
  divider: "#E2E8F0",
  scrimTop: "rgba(10,17,40,0)",
  scrimBottom: "rgba(10,17,40,0.85)",
};

export const darkColors = {
  surface: "#060B19",
  onSurface: "#F8F9FA",
  surfaceSecondary: "#0F1A3A",
  onSurfaceSecondary: "#EAEFF5",
  surfaceTertiary: "#1A264F",
  onSurfaceTertiary: "#D0D7E5",
  surfaceInverse: "#F8F9FA",
  onSurfaceInverse: "#060B19",
  brand: "#D4AF37",
  brandPrimary: "#D4AF37",
  onBrandPrimary: "#060B19",
  brandSecondary: "#E5C05C",
  onBrandSecondary: "#0A1128",
  brandTertiary: "#4B3B17",
  onBrandTertiary: "#FDF1D6",
  success: "#40916C",
  warning: "#D4AF37",
  error: "#E63946",
  info: "#48CAE4",
  border: "#1A264F",
  borderStrong: "#293A60",
  divider: "#1A264F",
  scrimTop: "rgba(6,11,25,0)",
  scrimBottom: "rgba(6,11,25,0.92)",
};

export type ThemeColors = typeof lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

export const fonts = {
  display: Platform.select({ ios: "Georgia", android: "serif", default: "serif" }) as string,
  displayItalic: Platform.select({ ios: "Georgia-Italic", android: "serif", default: "serif" }) as string,
  text: Platform.select({ ios: "System", android: "sans-serif", default: "System" }) as string,
  textMedium: Platform.select({ ios: "System", android: "sans-serif-medium", default: "System" }) as string,
};

export const fontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 44,
};
