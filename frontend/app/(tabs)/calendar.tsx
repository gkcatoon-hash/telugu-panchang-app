import { Ionicons } from "@expo/vector-icons";
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
import { computePanchang, computeSunTimes, computeKalams, formatTime } from "@/src/data/panchang";
import { useLocation } from "@/src/data/LocationContext";
import { storage } from "@/src/utils/storage";
import { useLang } from "@/src/i18n/LanguageContext";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/theme/ThemeContext";
import { useTabBarBottomPadding } from "@/src/hooks/use-tabbar-inset";
import { fonts, fontSize, radius, spacing } from "@/src/theme/tokens";
import { toLocalDateKey } from "@/src/utils/date";

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function firstWeekday(y: number, m: number) {
  return new Date(y, m, 1).getDay();
}

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { t, lang } = useLang();
  const insets = useSafeAreaInsets();
  const bottomPad = useTabBarBottomPadding();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<Date>(today);

  const styles = makeStyles(colors);

  const grid = useMemo(() => {
    const dim = daysInMonth(year, month);
    const start = firstWeekday(year, month);
    const cells: (Date | null)[] = [];
    for (let i = 0; i < start; i++) cells.push(null);
    for (let d = 1; d <= dim; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [year, month]);

  const selectedPanchang = useMemo(() => computePanchang(selected), [selected]);
  const { location } = useLocation();
  const sunTimes = useMemo(() => computeSunTimes(selected, location.lat, location.lon), [selected, location]);
  const kalams = useMemo(() => (sunTimes.sunrise && sunTimes.sunset ? computeKalams(sunTimes.sunrise, sunTimes.sunset, selected.getDay()) : null), [sunTimes, selected]);
  const [festivals, setFestivals] = React.useState<typeof FESTIVALS_2026>(FESTIVALS_2026);
  React.useEffect(() => {
    (async () => {
      const cached = await storage.getItem("@manalife/festivals", FESTIVALS_2026);
      setFestivals(cached ?? FESTIVALS_2026);
    })();
  }, []);
  const festivalMap = useMemo(() => {
    const m = new Map<string, (typeof FESTIVALS_2026)[number]>();
    for (const f of festivals) m.set(f.date, f);
    return m;
  }, [festivals]);
  const selectedIso = toLocalDateKey(selected);
  const selectedFestival = festivalMap.get(selectedIso);

  const monthLabel = new Date(year, month, 1).toLocaleDateString(
    lang === "te" ? "te-IN" : "en-IN",
    { month: "long", year: "numeric" }
  );

  const weekDays =
    lang === "te"
      ? ["ఆది", "సోమ", "మంగ", "బుధ", "గురు", "శుక్ర", "శని"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const router = useRouter();

  const changeMonth = (delta: number) => {
    Haptics.selectionAsync().catch(() => {});
    let newM = month + delta;
    let newY = year;
    if (newM < 0) { newM = 11; newY -= 1; }
    if (newM > 11) { newM = 0; newY += 1; }
    setMonth(newM);
    setYear(newY);
  };

  const pick = (en: string, te: string) => (lang === "te" ? te : en);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("tab_calendar")}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad }} showsVerticalScrollIndicator={false}>
        <View style={styles.monthBar}>
          <Pressable onPress={() => changeMonth(-1)} style={styles.arrowBtn} testID="cal-prev-month">
            <Ionicons name="chevron-back" size={20} color={colors.brand} />
          </Pressable>
          <Text style={styles.monthLabel} testID="cal-month-label">
            {monthLabel}
          </Text>
          <Pressable onPress={() => changeMonth(1)} style={styles.arrowBtn} testID="cal-next-month">
            <Ionicons name="chevron-forward" size={20} color={colors.brand} />
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {weekDays.map((w) => (
            <Text key={w} style={styles.weekDay}>
              {w}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {grid.map((d, i) => {
            if (!d) return <View key={i} style={styles.cell} />;
          const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const hasFestival = festivalMap.has(iso);
            const isToday =
              d.toDateString() === today.toDateString();
            const isSelected =
              d.toDateString() === selected.toDateString();
            return (
              <Pressable
                key={i}
                style={styles.cell}
                onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    const iso = d.toISOString().slice(0, 10);
                    router.push(`/day/${iso}`);
                  }}
                testID={`cal-day-${iso}`}
              >
                <View
                  style={[
                    styles.dayPill,
                    isSelected && { backgroundColor: colors.brand },
                    !isSelected && isToday && {
                      borderColor: colors.brand,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && { color: colors.onBrandPrimary, fontWeight: "700" },
                    ]}
                  >
                    {d.getDate()}
                  </Text>
                </View>
                {hasFestival ? (
                  <View style={[styles.festivalDot, isSelected && { backgroundColor: colors.onBrandPrimary }]} />
                ) : (
                  <View style={styles.dotSpace} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Selected day details */}
        <View style={styles.detailCard} testID="cal-detail-card">
          <Text style={styles.detailDate}>
            {selected.toLocaleDateString(lang === "te" ? "te-IN" : "en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("tithi")}</Text>
            <Text style={styles.detailValue}>
              {pick(selectedPanchang.tithi.nameEn, selectedPanchang.tithi.nameTe)}
              {"  "}
              <Text style={styles.detailSub}>
                ({pick(
                  selectedPanchang.tithi.paksha === "shukla" ? "Shukla" : "Krishna",
                  selectedPanchang.tithi.paksha === "shukla" ? "శుక్ల" : "కృష్ణ"
                )})
              </Text>
              <Text style={styles.detailSub}>
                {"  "}
                {t("ends_at")}: {formatTime(selectedPanchang.tithi.endsAt, location.tz)}
              </Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("nakshatra")}</Text>
            <Text style={styles.detailValue}>
              {pick(selectedPanchang.nakshatra.nameEn, selectedPanchang.nakshatra.nameTe)}
              <Text style={styles.detailSub}>
                {"  "}{t("ends_at")}:{" "}{formatTime(selectedPanchang.nakshatra.endsAt, location.tz)}
              </Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("yoga")}</Text>
            <Text style={styles.detailValue}>
              {pick(selectedPanchang.yoga.nameEn, selectedPanchang.yoga.nameTe)}
              <Text style={styles.detailSub}>
                {"  "}{t("ends_at")}:{" "}{formatTime(selectedPanchang.yoga.endsAt, location.tz)}
              </Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("vara")}</Text>
            <Text style={styles.detailValue}>
              {pick(selectedPanchang.vara.nameEn, selectedPanchang.vara.nameTe)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("masa")}</Text>
            <Text style={styles.detailValue}>
              {pick(selectedPanchang.masa.nameEn, selectedPanchang.masa.nameTe)}
            </Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("sunrise")}</Text>
            <Text style={styles.detailValue}>{formatTime(sunTimes.sunrise, location.tz)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("sunset")}</Text>
            <Text style={styles.detailValue}>{formatTime(sunTimes.sunset, location.tz)}</Text>
          </View>
          {kalams ? (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t("rahukalam")}</Text>
                <Text style={styles.detailValue}>
                  {formatTime(kalams.rahu.start, location.tz)} - {formatTime(kalams.rahu.end, location.tz)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t("yama")}</Text>
                <Text style={styles.detailValue}>
                  {formatTime(kalams.yama.start, location.tz)} - {formatTime(kalams.yama.end, location.tz)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t("gulika")}</Text>
                <Text style={styles.detailValue}>
                  {formatTime(kalams.gulika.start, location.tz)} - {formatTime(kalams.gulika.end, location.tz)}
                </Text>
              </View>
            </>
          ) : null}
          {selectedFestival ? (
            <View>
              <Text style={styles.festivalBadge}>{t("festival")}</Text>
              <Text style={styles.festivalName}>
                {pick(selectedFestival.nameEn, selectedFestival.nameTe)}
              </Text>
              <Text style={styles.festivalDesc}>
                {pick(selectedFestival.descriptionEn, selectedFestival.descriptionTe)}
              </Text>
            </View>
          ) : (
            <Text style={styles.noFestival}>{t("no_festival_today")}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.surface },
    header: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
    },
    title: {
      fontFamily: fonts.display,
      fontSize: fontSize["3xl"],
      color: colors.onSurface,
    },
    monthBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },
    arrowBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceSecondary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    monthLabel: {
      fontFamily: fonts.display,
      fontSize: fontSize.xl,
      color: colors.onSurface,
    },
    weekRow: {
      flexDirection: "row",
      paddingHorizontal: spacing.md,
      marginTop: spacing.sm,
    },
    weekDay: {
      flex: 1,
      textAlign: "center",
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.xs,
      textTransform: "uppercase",
      letterSpacing: 1,
      fontWeight: "600",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: spacing.md,
      marginTop: spacing.sm,
    },
    cell: {
      width: `${100 / 7}%`,
      alignItems: "center",
      paddingVertical: spacing.xs,
    },
    dayPill: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    dayText: {
      color: colors.onSurface,
      fontSize: fontSize.base,
      fontFamily: fonts.text,
    },
    festivalDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.brand,
      marginTop: 3,
    },
    dotSpace: { width: 4, height: 4, marginTop: 3 },
    detailCard: {
      marginHorizontal: spacing.xl,
      marginTop: spacing.xl,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: radius.lg,
      padding: spacing.xl,
      borderWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth : 0,
      borderColor: colors.border,
    },
    detailDate: {
      fontFamily: fonts.display,
      fontSize: fontSize.xl,
      color: colors.onSurfaceSecondary,
      marginBottom: spacing.lg,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
    },
    detailLabel: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.sm,
      textTransform: "uppercase",
      letterSpacing: 1,
      fontWeight: "600",
    },
    detailValue: {
      color: colors.onSurfaceSecondary,
      fontFamily: fonts.display,
      fontSize: fontSize.lg,
    },
    detailSub: {
      color: colors.onSurfaceTertiary,
      fontFamily: fonts.text,
      fontSize: fontSize.base,
    },
    divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.lg },
    festivalBadge: {
      color: colors.brand,
      fontSize: fontSize.xs,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      fontWeight: "700",
      marginBottom: spacing.xs,
    },
    festivalName: {
      color: colors.onSurfaceSecondary,
      fontFamily: fonts.display,
      fontSize: fontSize["2xl"],
      marginBottom: spacing.xs,
    },
    festivalDesc: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.base,
      lineHeight: 22,
    },
    noFestival: {
      color: colors.onSurfaceTertiary,
      fontSize: fontSize.base,
      textAlign: "center",
      fontStyle: "italic",
    },
  });
