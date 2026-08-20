import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLocation } from "@/src/data/LocationContext";
import { computeKalams, computePanchang, computeSunTimes, formatTime } from "@/src/data/panchang";
import { quoteOfTheDay, slokaOfTheDay } from "@/src/data/slokas";
import { FESTIVALS_2026 } from "@/src/data/festivals";
import { useLang } from "@/src/i18n/LanguageContext";
import { useTheme } from "@/src/theme/ThemeContext";
import { useTabBarBottomPadding } from "@/src/hooks/use-tabbar-inset";
import { fonts, fontSize, radius, spacing } from "@/src/theme/tokens";
import { toLocalDateKey } from "@/src/utils/date";

const HERO_DARK =
  "https://images.unsplash.com/photo-1643220505856-08067e86e995?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGdvbGQlMjBhbmQlMjBibHVlJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3ODMzOTk5MTR8MA&ixlib=rb-4.1.0&q=85";
const HERO_LIGHT =
  "https://images.unsplash.com/photo-1646523773249-23fea630a7a5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdvbGQlMjBhbmQlMjBibHVlJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3ODMzOTk5MTR8MA&ixlib=rb-4.1.0&q=85";

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { t, lang } = useLang();
  const { location } = useLocation();
  const insets = useSafeAreaInsets();
  const bottomPad = useTabBarBottomPadding();

  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  const panchang = useMemo(() => computePanchang(now), [now]);
  const { sunrise, sunset } = useMemo(
    () => computeSunTimes(now, location.lat, location.lon),
    [now, location.lat, location.lon]
  );
  const kalams = useMemo(() => {
    if (!sunrise || !sunset) return null;
    return computeKalams(sunrise, sunset, panchang.vara.index);
  }, [sunrise, sunset, panchang.vara.index]);

  const sloka = useMemo(() => slokaOfTheDay(now), [now]);
  const quote = useMemo(() => quoteOfTheDay(now), [now]);
  const nextFestival = useMemo(() => {
    const iso = toLocalDateKey(now);
    return FESTIVALS_2026.find((f) => f.date >= iso);
  }, [now]);

  const pick = (en: string, te: string) => (lang === "te" ? te : en);

  const dateLabel = now.toLocaleDateString(lang === "te" ? "te-IN" : "en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const styles = makeStyles(colors);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <Image
            source={{ uri: isDark ? HERO_DARK : HERO_LIGHT }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={[colors.scrimTop, colors.scrimBottom]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroContent, { paddingTop: insets.top + spacing.lg }]}>
            <Text style={styles.brand} testID="app-brand">
              {t("appName")}
            </Text>
            <Text style={styles.dateText}>{dateLabel}</Text>

            <View style={styles.tithiBlock}>
              <Text style={styles.tithiLabel}>{t("tithi")}</Text>
              <Text style={styles.tithiName} testID="home-tithi-name">
                {pick(panchang.tithi.nameEn, panchang.tithi.nameTe)}
              </Text>
              <Text style={styles.paksha}>
                {pick(
                  panchang.tithi.paksha === "shukla" ? "Shukla Paksha" : "Krishna Paksha",
                  panchang.tithi.paksha === "shukla" ? "శుక్ల పక్షం" : "కృష్ణ పక్షం"
                )}
                {"  •  "}
                {pick(panchang.masa.nameEn, panchang.masa.nameTe)}
              </Text>
            </View>
          </View>
        </View>

        {/* PANCHANG QUICK GRID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("today_panchang")}</Text>
          <View style={styles.grid}>
            <PanchangTile
              label={t("nakshatra")}
              value={pick(panchang.nakshatra.nameEn, panchang.nakshatra.nameTe)}
                subtext={`${pick("till", "వరకు")} ${formatTime(panchang.nakshatra.endsAt, location.tz)}`}
              icon="star-outline"
              testID="home-nakshatra"
              colors={colors}
            />
            <PanchangTile
              label={t("yoga")}
              value={pick(panchang.yoga.nameEn, panchang.yoga.nameTe)}
                subtext={`${pick("till", "వరకు")} ${formatTime(panchang.yoga.endsAt, location.tz)}`}
              icon="infinite-outline"
              testID="home-yoga"
              colors={colors}
            />
            <PanchangTile
              label={t("karana")}
              value={pick(panchang.karana.nameEn, panchang.karana.nameTe)}
              icon="ellipsis-horizontal-circle-outline"
              testID="home-karana"
              colors={colors}
            />
            <PanchangTile
              label={t("vara")}
              value={pick(panchang.vara.nameEn, panchang.vara.nameTe)}
              icon="sunny-outline"
              testID="home-vara"
              colors={colors}
            />
          </View>
        </View>

        {/* SUNRISE / SUNSET */}
        <View style={styles.section}>
          <View style={styles.sunCard}>
            <View style={styles.sunItem}>
              <Ionicons name="sunny" size={22} color={colors.brand} />
              <Text style={styles.sunLabel}>{t("sunrise")}</Text>
              <Text style={styles.sunTime} testID="home-sunrise">
                {formatTime(sunrise, location.tz)}
              </Text>
            </View>
            <View style={styles.sunDivider} />
            <View style={styles.sunItem}>
              <Ionicons name="moon" size={22} color={colors.brand} />
              <Text style={styles.sunLabel}>{t("sunset")}</Text>
              <Text style={styles.sunTime} testID="home-sunset">
                {formatTime(sunset, location.tz)}
              </Text>
            </View>
            <View style={styles.sunDivider} />
            <View style={styles.sunItem}>
              <Ionicons name="location" size={20} color={colors.brand} />
              <Text style={styles.sunLabel}>{t("location")}</Text>
              <Text style={styles.sunTime}>{location.name}</Text>
            </View>
          </View>
        </View>

        {/* INAUSPICIOUS PERIODS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("inauspicious_timings")}</Text>
          {kalams ? (
            <View style={styles.kalamList}>
              <KalamRow
                label={t("rahukalam")}
                start={kalams.rahu.start}
                end={kalams.rahu.end}
                accent="#9B2226"
                colors={colors}
                testID="home-rahukalam"
              />
              <KalamRow
                label={t("yamagandam")}
                start={kalams.yama.start}
                end={kalams.yama.end}
                accent="#B08D57"
                colors={colors}
                testID="home-yamagandam"
              />
              <KalamRow
                label={t("gulika")}
                start={kalams.gulika.start}
                end={kalams.gulika.end}
                accent="#005F73"
                colors={colors}
                testID="home-gulika"
              />
            </View>
          ) : null}
        </View>

        {/* NEXT FESTIVAL */}
        {nextFestival && (
          <View style={styles.section}>
            <View style={styles.festivalCard}>
              <View style={styles.festivalBadge}>
                <Ionicons name="sparkles" size={14} color={colors.onBrandPrimary} />
                <Text style={styles.festivalBadgeText}>
                  {pick("Upcoming", "రాబోతోంది")}
                </Text>
              </View>
              <Text style={styles.festivalName} testID="home-next-festival">
                {pick(nextFestival.nameEn, nextFestival.nameTe)}
              </Text>
              <Text style={styles.festivalDate}>
                {new Date(nextFestival.date).toLocaleDateString(
                  lang === "te" ? "te-IN" : "en-IN",
                  { weekday: "long", day: "numeric", month: "long" }
                )}
              </Text>
              <Text style={styles.festivalDesc} numberOfLines={2}>
                {pick(nextFestival.descriptionEn, nextFestival.descriptionTe)}
              </Text>
            </View>
          </View>
        )}

        {/* DEVOTIONAL QUOTE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("daily_devotion")}</Text>
          <View style={styles.quoteCard} testID="home-daily-quote">
            <Ionicons
              name="flower"
              size={28}
              color={colors.brand}
              style={{ marginBottom: spacing.sm }}
            />
            <Text style={styles.quoteText}>&ldquo;{pick(quote.en, quote.te)}&rdquo;</Text>
            <View style={styles.divider} />
            <Text style={styles.slokaTitle}>{pick(sloka.titleEn, sloka.titleTe)}</Text>
            <Text style={styles.slokaSanskrit}>{sloka.sanskrit}</Text>
            <Text style={styles.slokaMeaning}>
              {pick(sloka.meaningEn, sloka.meaningTe)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function PanchangTile({
  label,
  value,
  subtext,
  icon,
  testID,
  colors,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon: keyof typeof Ionicons.glyphMap;
  testID?: string;
  colors: any;
}) {
  const styles = makeStyles(colors);
  return (
    <View style={styles.tile} testID={testID}>
      <View style={styles.tileIcon}>
        <Ionicons name={icon} size={16} color={colors.brand} />
      </View>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue} numberOfLines={1}>
        {value}
      </Text>
      {subtext ? <Text style={styles.tileSub}>{subtext}</Text> : null}
    </View>
  );
}

function KalamRow({
  label,
  start,
  end,
  accent,
  colors,
  testID,
}: {
  label: string;
  start: Date;
  end: Date;
  accent: string;
  colors: any;
  testID?: string;
}) {
  const styles = makeStyles(colors);
  return (
    <View style={styles.kalamRow} testID={testID}>
      <View style={[styles.kalamDot, { backgroundColor: accent }]} />
      <Text style={styles.kalamLabel}>{label}</Text>
      <Text style={styles.kalamTime}>
        {formatTime(start)} — {formatTime(end)}
      </Text>
    </View>
  );
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.surface },
    hero: {
      height: 340,
      overflow: "hidden",
      backgroundColor: colors.surfaceInverse,
    },
    heroContent: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
      justifyContent: "flex-end",
    },
    brand: {
      fontFamily: fonts.display,
      fontSize: fontSize.xl,
      color: colors.brand,
      letterSpacing: 2,
      marginBottom: spacing.xs,
    },
    dateText: {
      color: "#EAEFF5",
      fontFamily: fonts.text,
      fontSize: fontSize.base,
      opacity: 0.9,
      marginBottom: spacing.lg,
    },
    tithiBlock: {},
    tithiLabel: {
      color: colors.brand,
      fontSize: fontSize.sm,
      letterSpacing: 2,
      textTransform: "uppercase",
      fontWeight: "700",
      marginBottom: spacing.xs,
    },
    tithiName: {
      color: "#FFFFFF",
      fontFamily: fonts.display,
      fontSize: fontSize["4xl"],
      lineHeight: fontSize["4xl"] + 4,
    },
    paksha: {
      color: "#EAEFF5",
      fontSize: fontSize.base,
      marginTop: spacing.xs,
    },
    section: {
      paddingHorizontal: spacing.xl,
      marginTop: spacing.xl,
    },
    sectionTitle: {
      fontFamily: fonts.display,
      fontSize: fontSize.xl,
      color: colors.onSurface,
      marginBottom: spacing.md,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.md,
    },
    tile: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: radius.lg,
      padding: spacing.lg,
      width: "48%",
      minHeight: 108,
      borderWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth : 0,
      borderColor: colors.border,
    },
    tileIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.brandTertiary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.sm,
    },
    tileLabel: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.xs,
      letterSpacing: 1.4,
      textTransform: "uppercase",
      fontWeight: "600",
    },
    tileValue: {
      color: colors.onSurfaceSecondary,
      fontFamily: fonts.display,
      fontSize: fontSize.lg,
      marginTop: spacing.xs,
    },
    tileSub: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.xs,
      marginTop: spacing.xs,
    },
    sunCard: {
      flexDirection: "row",
      backgroundColor: colors.surfaceSecondary,
      borderRadius: radius.lg,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth : 0,
      borderColor: colors.border,
    },
    sunItem: { flex: 1, alignItems: "center" },
    sunDivider: {
      width: 1,
      height: 40,
      backgroundColor: colors.divider,
    },
    sunLabel: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.xs,
      marginTop: spacing.xs,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    sunTime: {
      color: colors.onSurfaceSecondary,
      fontFamily: fonts.display,
      fontSize: fontSize.lg,
      marginTop: 2,
    },
    kalamList: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: radius.lg,
      overflow: "hidden",
      borderWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth : 0,
      borderColor: colors.border,
    },
    kalamRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    kalamDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.md },
    kalamLabel: {
      flex: 1,
      color: colors.onSurfaceSecondary,
      fontFamily: fonts.display,
      fontSize: fontSize.lg,
    },
    kalamTime: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.base,
      fontFamily: fonts.text,
      fontVariant: ["tabular-nums"],
    },
    festivalCard: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: radius.lg,
      padding: spacing.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.brand,
    },
    festivalBadge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.brand,
      paddingHorizontal: spacing.md,
      paddingVertical: 4,
      borderRadius: radius.pill,
      marginBottom: spacing.md,
    },
    festivalBadgeText: {
      color: colors.onBrandPrimary,
      fontSize: fontSize.xs,
      fontWeight: "700",
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    festivalName: {
      color: colors.onSurfaceSecondary,
      fontFamily: fonts.display,
      fontSize: fontSize["2xl"],
      marginBottom: 4,
    },
    festivalDate: {
      color: colors.brand,
      fontSize: fontSize.base,
      marginBottom: spacing.sm,
    },
    festivalDesc: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.base,
      lineHeight: 20,
    },
    quoteCard: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: radius.lg,
      padding: spacing.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    quoteText: {
      color: colors.onSurfaceSecondary,
      fontFamily: fonts.display,
      fontSize: fontSize.xl,
      lineHeight: fontSize.xl + 8,
      fontStyle: "italic",
    },
    divider: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: spacing.lg,
    },
    slokaTitle: {
      color: colors.brand,
      fontSize: fontSize.sm,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      fontWeight: "700",
      marginBottom: spacing.sm,
    },
    slokaSanskrit: {
      color: colors.onSurfaceSecondary,
      fontFamily: fonts.display,
      fontSize: fontSize.lg,
      lineHeight: fontSize.lg + 8,
      marginBottom: spacing.md,
    },
    slokaMeaning: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.base,
      lineHeight: 22,
    },
  });

