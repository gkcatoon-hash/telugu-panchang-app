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

import { FESTIVALS_2026 } from "@/src/data/festivals";
import { useLang } from "@/src/i18n/LanguageContext";
import { useTheme } from "@/src/theme/ThemeContext";
import { useTabBarBottomPadding } from "@/src/hooks/use-tabbar-inset";
import { fonts, fontSize, radius, spacing } from "@/src/theme/tokens";

const HERO_IMG = "https://images.pexels.com/photos/38122489/pexels-photo-38122489.jpeg";

type Filter = "all" | "festival" | "vratham";

export default function FestivalsScreen() {
  const { colors } = useTheme();
  const { t, lang } = useLang();
  const insets = useSafeAreaInsets();
  const bottomPad = useTabBarBottomPadding();
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const sorted = [...FESTIVALS_2026].sort((a, b) => a.date.localeCompare(b.date));
    const upcoming = sorted.filter((f) => f.date >= today);
    const past = sorted.filter((f) => f.date < today);
    const full = [...upcoming, ...past]; // upcoming first, then past for reference
    if (filter === "all") return full;
    return full.filter((f) => f.kind === filter);
  }, [filter]);

  // Group by month for display
  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const it of items) {
      const d = new Date(it.date);
      const key = d.toLocaleDateString(lang === "te" ? "te-IN" : "en-IN", {
        month: "long",
        year: "numeric",
      });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }
    return Array.from(map.entries());
  }, [items, lang]);

  const styles = makeStyles(colors);
  const pick = (en: string, te: string) => (lang === "te" ? te : en);

  const chips: { key: Filter; label: string }[] = [
    { key: "all", label: pick("All", "అన్నీ") },
    { key: "festival", label: t("festival") },
    { key: "vratham", label: t("vratham") },
  ];

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={{ uri: HERO_IMG }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={[colors.scrimTop, colors.scrimBottom]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroContent, { paddingTop: insets.top + spacing.lg }]}>
            <Text style={styles.eyebrow}>{t("upcoming_festivals")}</Text>
            <Text style={styles.heroTitle}>
              {pick("Sacred", "పవిత్ర")}{"\n"}
              {pick("Occasions", "సందర్భాలు")}
            </Text>
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          style={styles.chipsStrip}
        >
          {chips.map((c) => {
            const active = filter === c.key;
            return (
              <Pressable
                key={c.key}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setFilter(c.key);
                }}
                style={[styles.chip, active && styles.chipActive]}
                testID={`festival-chip-${c.key}`}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* List */}
        {grouped.length === 0 ? (
          <Text style={styles.empty}>{t("no_festivals")}</Text>
        ) : (
          grouped.map(([month, list]) => (
            <View key={month} style={styles.monthGroup}>
              <Text style={styles.monthHeader}>{month}</Text>
              {list.map((f) => {
                const d = new Date(f.date);
                const day = d.getDate();
                const wd = d.toLocaleDateString(lang === "te" ? "te-IN" : "en-IN", {
                  weekday: "short",
                });
                return (
                  <View key={f.id} style={styles.item} testID={`festival-item-${f.id}`}>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateDay}>{day}</Text>
                      <Text style={styles.dateWd}>{wd}</Text>
                    </View>
                    <View style={styles.itemBody}>
                      <View style={styles.kindRow}>
                        <View
                          style={[
                            styles.kindPill,
                            f.kind === "vratham"
                              ? { backgroundColor: colors.brandTertiary }
                              : { backgroundColor: "rgba(212,175,55,0.16)" },
                          ]}
                        >
                          <Ionicons
                            name={f.kind === "vratham" ? "flame" : "sparkles"}
                            size={10}
                            color={colors.brand}
                          />
                          <Text style={styles.kindText}>
                            {f.kind === "vratham" ? t("vratham") : t("festival")}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {pick(f.nameEn, f.nameTe)}
                      </Text>
                      <Text style={styles.itemDesc} numberOfLines={2}>
                        {pick(f.descriptionEn, f.descriptionTe)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.surface },
    hero: { height: 260, overflow: "hidden", backgroundColor: colors.surfaceInverse },
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
      fontSize: fontSize["4xl"],
      lineHeight: fontSize["4xl"] + 4,
    },
    chipsStrip: {
      marginTop: spacing.lg,
      height: 56,
    },
    chipsRow: {
      paddingHorizontal: spacing.xl,
      gap: spacing.sm,
      alignItems: "center",
    },
    chip: {
      height: 36,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceSecondary,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    chipActive: {
      borderColor: colors.brand,
      backgroundColor: "rgba(212,175,55,0.12)",
    },
    chipText: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.base,
      fontFamily: fonts.text,
      fontWeight: "600",
    },
    chipTextActive: { color: colors.brand },
    monthGroup: { marginTop: spacing.xl, paddingHorizontal: spacing.xl },
    monthHeader: {
      fontFamily: fonts.display,
      fontSize: fontSize.xl,
      color: colors.onSurface,
      marginBottom: spacing.md,
    },
    item: {
      flexDirection: "row",
      backgroundColor: colors.surfaceSecondary,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth : 0,
      borderColor: colors.border,
    },
    dateBox: {
      width: 56,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.lg,
      backgroundColor: colors.surfaceTertiary,
      borderRadius: radius.md,
      paddingVertical: spacing.sm,
    },
    dateDay: {
      color: colors.brand,
      fontFamily: fonts.display,
      fontSize: fontSize["2xl"],
    },
    dateWd: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.xs,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginTop: 2,
    },
    itemBody: { flex: 1 },
    kindRow: { flexDirection: "row", marginBottom: spacing.xs },
    kindPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radius.pill,
    },
    kindText: {
      color: colors.brand,
      fontSize: fontSize.xs,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    itemName: {
      color: colors.onSurfaceSecondary,
      fontFamily: fonts.display,
      fontSize: fontSize.lg,
      marginBottom: 2,
    },
    itemDesc: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.sm,
      lineHeight: 18,
    },
    empty: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.base,
      textAlign: "center",
      padding: spacing.xxl,
    },
  });
