import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Platform, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { computePanchang, computeSunTimes, computeKalams, formatTime } from "@/src/data/panchang";
import { FESTIVALS_2026 } from "@/src/data/festivals";
import { storage } from "@/src/utils/storage";
import { useLang } from "@/src/i18n/LanguageContext";
import { useTheme } from "@/src/theme/ThemeContext";
import { fonts, fontSize, radius, spacing } from "@/src/theme/tokens";
import { useLocation } from "@/src/data/LocationContext";

export default function DayDetails() {
  const { date: dateParam } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { t, lang } = useLang();
  const insets = useSafeAreaInsets();
  const { location } = useLocation();

  const dateIso = String(dateParam || new Date().toISOString().slice(0, 10));
  const date = useMemo(() => new Date(dateIso + "T00:00:00"), [dateIso]);

  const panchang = useMemo(() => computePanchang(date), [date]);
  const sunTimes = useMemo(() => computeSunTimes(date, location.lat, location.lon), [date, location]);
  const kalams = useMemo(() => (sunTimes.sunrise && sunTimes.sunset ? computeKalams(sunTimes.sunrise, sunTimes.sunset, date.getDay()) : null), [sunTimes, date]);

  const [festivals, setFestivals] = useState<typeof FESTIVALS_2026>(FESTIVALS_2026);
  React.useEffect(() => {
    (async () => {
      const cached = await storage.getItem("@manalife/festivals", FESTIVALS_2026);
      setFestivals(cached ?? FESTIVALS_2026);
    })();
  }, []);

  const festival = festivals.find((f) => f.date === dateIso);

  const pick = (en: string, te: string) => (lang === "te" ? te : en);

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Text style={{ color: colors.brand }}>{t("close")}</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.onSurface }]}>{date.toLocaleDateString(lang === "te" ? "te-IN" : "en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 120 }}>
        <View style={[styles.card, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <Row label={t("tithi")} value={pick(panchang.tithi.nameEn, panchang.tithi.nameTe)} sub={`${t("ends_at")}: ${formatTime(panchang.tithi.endsAt, location.tz)}`} colors={colors} />
          <Row label={t("nakshatra")} value={pick(panchang.nakshatra.nameEn, panchang.nakshatra.nameTe)} sub={`${t("ends_at")}: ${formatTime(panchang.nakshatra.endsAt, location.tz)}`} colors={colors} />
          <Row label={t("yoga")} value={pick(panchang.yoga.nameEn, panchang.yoga.nameTe)} sub={`${t("ends_at")}: ${formatTime(panchang.yoga.endsAt, location.tz)}`} colors={colors} />
          <Row label={t("karana")} value={panchang.karana.nameEn} colors={colors} />
          <Row label={t("vara")} value={pick(panchang.vara.nameEn, panchang.vara.nameTe)} colors={colors} />

          <View style={styles.divider} />
          <Row label={t("sunrise")} value={formatTime(sunTimes.sunrise, location.tz)} colors={colors} />
          <Row label={t("sunset")} value={formatTime(sunTimes.sunset, location.tz)} colors={colors} />
          {kalams ? (
            <>
              <Row label={t("rahukalam")} value={`${formatTime(kalams.rahu.start, location.tz)} - ${formatTime(kalams.rahu.end, location.tz)}`} colors={colors} />
              <Row label={t("yamagandam")} value={`${formatTime(kalams.yama.start, location.tz)} - ${formatTime(kalams.yama.end, location.tz)}`} colors={colors} />
              <Row label={t("gulika")} value={`${formatTime(kalams.gulika.start, location.tz)} - ${formatTime(kalams.gulika.end, location.tz)}`} colors={colors} />
            </>
          ) : null}

          <View style={styles.divider} />
          {festival ? (
            <View>
              <Text style={{ color: colors.brand, fontSize: fontSize.xs, textTransform: "uppercase", fontWeight: "700", marginBottom: spacing.sm }}>{t("festival")}</Text>
              <Text style={{ color: colors.onSurfaceSecondary, fontFamily: fonts.display, fontSize: fontSize["2xl"], marginBottom: spacing.sm }}>{pick(festival.nameEn, festival.nameTe)}</Text>
              <Text style={{ color: colors.onSurfaceTertiary }}>{pick(festival.descriptionEn, festival.descriptionTe)}</Text>
            </View>
          ) : (
            <Text style={{ color: colors.onSurfaceTertiary, fontStyle: "italic" }}>{t("no_festival_today")}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ label, value, sub, colors }: { label: string; value: string; sub?: string; colors: any }) {
  return (
    <View style={{ paddingVertical: spacing.sm }}>
      <Text style={{ color: colors.onSurfaceTertiary, fontSize: fontSize.sm, textTransform: "uppercase", letterSpacing: 1, fontWeight: "600" }}>{label}</Text>
      <Text style={{ color: colors.onSurfaceSecondary, fontFamily: fonts.display, fontSize: fontSize.lg }}>{value}</Text>
      {sub ? <Text style={{ color: colors.onSurfaceTertiary, fontSize: fontSize.base, marginTop: 4 }}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  title: { fontFamily: fonts.display, fontSize: fontSize["2xl"] },
  card: { borderRadius: radius.lg, padding: spacing.lg, borderWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth : 0 },
  divider: { height: 1, backgroundColor: "rgba(0,0,0,0.06)", marginVertical: spacing.lg },
});
