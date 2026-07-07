import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { slokaOfTheDay, SLOKAS, Sloka } from "@/src/data/slokas";
import { useLang } from "@/src/i18n/LanguageContext";
import { useTheme } from "@/src/theme/ThemeContext";
import { useTabBarBottomPadding } from "@/src/hooks/use-tabbar-inset";
import { fonts, fontSize, radius, spacing } from "@/src/theme/tokens";

const KRISHNA_IMG =
  "https://images.unsplash.com/photo-1641730259879-ad98e7db7bcb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxMb3JkJTIwS3Jpc2huYSUyMHBsYXlpbmclMjBmbHV0ZXxlbnwwfHx8fDE3ODIwMjMwNzF8MA&ixlib=rb-4.1.0&q=85";

const DEITY_META: {
  key: Sloka["deity"];
  labelEn: string;
  labelTe: string;
  icon: keyof typeof import("@expo/vector-icons/Ionicons").glyphMap;
}[] = [
  { key: "Ganesha", labelEn: "Ganesha", labelTe: "గణపతి", icon: "flower" },
  { key: "Krishna", labelEn: "Krishna", labelTe: "కృష్ణుడు", icon: "musical-notes" },
  { key: "Rama", labelEn: "Sri Rama", labelTe: "శ్రీరాముడు", icon: "leaf" },
  { key: "Shiva", labelEn: "Shiva", labelTe: "శివుడు", icon: "flame" },
  { key: "Devi", labelEn: "Devi", labelTe: "దేవి", icon: "star" },
  { key: "Vishnu", labelEn: "Vishnu", labelTe: "విష్ణువు", icon: "planet" },
  { key: "Hanuman", labelEn: "Hanuman", labelTe: "హనుమాన్", icon: "shield" },
];

export default function DevotionScreen() {
  const { colors } = useTheme();
  const { t, lang } = useLang();
  const insets = useSafeAreaInsets();
  const bottomPad = useTabBarBottomPadding();
  const [activeDeity, setActiveDeity] = useState<Sloka["deity"] | null>(null);

  const today = useMemo(() => new Date(), []);
  const daily = useMemo(() => slokaOfTheDay(today), [today]);
  const filteredSlokas = useMemo(
    () => (activeDeity ? SLOKAS.filter((s) => s.deity === activeDeity) : SLOKAS),
    [activeDeity]
  );

  const styles = makeStyles(colors);
  const pick = (en: string, te: string) => (lang === "te" ? te : en);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad }} showsVerticalScrollIndicator={false}>
        {/* Hero Sloka card with Krishna image */}
        <View style={styles.hero}>
          <Image source={{ uri: KRISHNA_IMG }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={[colors.scrimTop, colors.scrimBottom]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroContent, { paddingTop: insets.top + spacing.lg }]}>
            <Text style={styles.eyebrow}>{t("daily_sloka")}</Text>
            <Text style={styles.heroTitle}>
              {pick(daily.titleEn, daily.titleTe)}
            </Text>
            <Text style={styles.heroSanskrit} numberOfLines={3}>
              {daily.sanskrit}
            </Text>
          </View>
        </View>

        {/* Deity chip strip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("deities")}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.deityRow}
          >
            <Pressable
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setActiveDeity(null);
              }}
              style={[styles.deityChip, !activeDeity && styles.deityChipActive]}
              testID="deity-chip-all"
            >
              <Ionicons name="star-outline" size={14} color={!activeDeity ? colors.onBrandPrimary : colors.brand} />
              <Text style={[styles.deityText, !activeDeity && styles.deityTextActive]}>
                {pick("All", "అన్నీ")}
              </Text>
            </Pressable>
            {DEITY_META.map((d) => {
              const active = activeDeity === d.key;
              return (
                <Pressable
                  key={d.key}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setActiveDeity(d.key);
                  }}
                  style={[styles.deityChip, active && styles.deityChipActive]}
                  testID={`deity-chip-${d.key}`}
                >
                  <Ionicons name={d.icon} size={14} color={active ? colors.onBrandPrimary : colors.brand} />
                  <Text style={[styles.deityText, active && styles.deityTextActive]}>
                    {pick(d.labelEn, d.labelTe)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Slokas list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("mantras")}</Text>
          {filteredSlokas.map((s) => (
            <View key={s.id} style={styles.slokaCard} testID={`sloka-${s.id}`}>
              <View style={styles.slokaHeader}>
                <Text style={styles.slokaTitle}>{pick(s.titleEn, s.titleTe)}</Text>
                <View style={styles.deityBadge}>
                  <Text style={styles.deityBadgeText}>{s.deity}</Text>
                </View>
              </View>
              <Text style={styles.slokaSanskrit}>{s.sanskrit}</Text>
              <View style={styles.slokaDivider} />
              <Text style={styles.slokaMeaningLabel}>
                {pick("Meaning", "అర్థం")}
              </Text>
              <Text style={styles.slokaMeaning}>{pick(s.meaningEn, s.meaningTe)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.surface },
    hero: { height: 340, overflow: "hidden", backgroundColor: colors.surfaceInverse },
    heroContent: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
      justifyContent: "flex-end",
    },
    eyebrow: {
      color: colors.brand,
      fontSize: fontSize.xs,
      letterSpacing: 2,
      textTransform: "uppercase",
      fontWeight: "700",
      marginBottom: spacing.sm,
    },
    heroTitle: {
      color: "#FFFFFF",
      fontFamily: fonts.display,
      fontSize: fontSize["3xl"],
      marginBottom: spacing.md,
    },
    heroSanskrit: {
      color: "#EAEFF5",
      fontFamily: fonts.display,
      fontSize: fontSize.lg,
      lineHeight: fontSize.lg + 6,
      fontStyle: "italic",
    },
    section: { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
    sectionTitle: {
      fontFamily: fonts.display,
      fontSize: fontSize.xl,
      color: colors.onSurface,
      marginBottom: spacing.md,
    },
    deityRow: {
      paddingRight: spacing.xl,
      gap: spacing.sm,
      alignItems: "center",
      height: 44,
    },
    deityChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      height: 36,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceSecondary,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      flexShrink: 0,
    },
    deityChipActive: {
      backgroundColor: colors.brand,
      borderColor: colors.brand,
    },
    deityText: {
      color: colors.onSurfaceSecondary,
      fontSize: fontSize.sm,
      fontWeight: "600",
    },
    deityTextActive: { color: colors.onBrandPrimary },
    slokaCard: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: radius.lg,
      padding: spacing.xl,
      marginBottom: spacing.md,
      borderWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth : 0,
      borderColor: colors.border,
    },
    slokaHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    slokaTitle: {
      fontFamily: fonts.display,
      fontSize: fontSize.xl,
      color: colors.onSurfaceSecondary,
      flex: 1,
    },
    deityBadge: {
      backgroundColor: colors.brandTertiary,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
      marginLeft: spacing.sm,
    },
    deityBadgeText: {
      color: colors.onBrandTertiary,
      fontSize: fontSize.xs,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    slokaSanskrit: {
      fontFamily: fonts.display,
      color: colors.onSurfaceSecondary,
      fontSize: fontSize.lg,
      lineHeight: fontSize.lg + 8,
    },
    slokaDivider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
    slokaMeaningLabel: {
      color: colors.brand,
      fontSize: fontSize.xs,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      fontWeight: "700",
      marginBottom: spacing.xs,
    },
    slokaMeaning: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.base,
      lineHeight: 22,
    },
  });
