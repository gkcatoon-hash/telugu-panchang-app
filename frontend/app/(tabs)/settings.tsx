import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PRESET_CITIES, useLocation } from "@/src/data/LocationContext";
import { Language, useLang } from "@/src/i18n/LanguageContext";
import { useTheme } from "@/src/theme/ThemeContext";
import { useTabBarBottomPadding } from "@/src/hooks/use-tabbar-inset";
import {
  fonts,
  fontSize,
  radius,
  spacing,
} from "@/src/theme/tokens";

const NOTIF_KEY = "@manalife/notifications-enabled";

export default function SettingsScreen() {
  const { colors, isDark, setMode } = useTheme();
  const { t, lang, setLang } = useLang();
  const { location, setLocation } = useLocation();

  const insets = useSafeAreaInsets();
  const bottomPad = useTabBarBottomPadding();

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [showLangSheet, setShowLangSheet] = useState(false);
  const [showLocSheet, setShowLocSheet] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem(NOTIF_KEY);
        setNotifEnabled(value === "1");
      } catch {}
    })();
  }, []);

  const toggleTheme = () => {
    Haptics.selectionAsync().catch(() => {});
    setMode(isDark ? "light" : "dark");
  };

  const toggleNotif = async (next: boolean) => {
    Haptics.selectionAsync().catch(() => {});
    setNotifEnabled(next);

    AsyncStorage.setItem(
      NOTIF_KEY,
      next ? "1" : "0"
    ).catch(() => {});

    try {
      if (next) {
        const permission =
          await Notifications.getPermissionsAsync();

        if (permission.status !== "granted") {
          const request =
            await Notifications.requestPermissionsAsync();

          if (request.status !== "granted") {
            setNotifEnabled(false);

            AsyncStorage.setItem(
              NOTIF_KEY,
              "0"
            ).catch(() => {});

            return;
          }
        }

        await Notifications.cancelAllScheduledNotificationsAsync();

        await Notifications.scheduleNotificationAsync({
          content: {
            title: t("notification_title"),
            body: t("notification_body"),
          },
          trigger: {
            type:
              Notifications.SchedulableTriggerInputTypes
                .CALENDAR,
            hour: 6,
            minute: 30,
            repeats: true,
          } as any,
        });
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.log(
        "Notification setup skipped:",
        error
      );
    }
  };

  const getLanguageLabel = () => {
    switch (lang) {
      case "te":
        return t("telugu");

      case "hi":
        return t("hindi");

      case "ta":
        return t("tamil");

      case "kn":
        return t("kannada");

      case "en":
      default:
        return t("english");
    }
  };

  const styles = makeStyles(colors);

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top },
      ]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: bottomPad,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {t("tab_settings")}
          </Text>
        </View>

        {/* Appearance */}
        <SectionLabel colors={colors}>
          {t("appearance")}
        </SectionLabel>

        <View style={styles.card}>
          <Row
            colors={colors}
            icon="moon-outline"
            label={t("dark_mode")}
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{
                  true: colors.brand,
                  false: colors.borderStrong,
                }}
                thumbColor={
                  Platform.OS === "android"
                    ? "#fff"
                    : undefined
                }
                testID="settings-dark-mode-switch"
              />
            }
          />

          <Divider colors={colors} />

          <Row
            colors={colors}
            icon="language-outline"
            label={t("language")}
            value={getLanguageLabel()}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setShowLangSheet(true);
            }}
            testID="settings-language-row"
            chevron
          />
        </View>

        {/* Notifications */}
        <SectionLabel colors={colors}>
          {t("notifications")}
        </SectionLabel>

        <View style={styles.card}>
          <Row
            colors={colors}
            icon="notifications-outline"
            label={t("notifications")}
            subtitle={t("notifications_desc")}
            right={
              <Switch
                value={notifEnabled}
                onValueChange={toggleNotif}
                trackColor={{
                  true: colors.brand,
                  false: colors.borderStrong,
                }}
                thumbColor={
                  Platform.OS === "android"
                    ? "#fff"
                    : undefined
                }
                testID="settings-notif-switch"
              />
            }
          />
        </View>

        {/* Location */}
        <SectionLabel colors={colors}>
          {t("location")}
        </SectionLabel>

        <View style={styles.card}>
          <Row
            colors={colors}
            icon="location-outline"
            label={location.name}
            subtitle={`${location.lat.toFixed(
              2
            )}°, ${location.lon.toFixed(2)}°`}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setShowLocSheet(true);
            }}
            testID="settings-location-row"
            chevron
          />
        </View>

        {/* About */}
        <SectionLabel colors={colors}>
          {t("about")}
        </SectionLabel>

        <View style={styles.card}>
          <Row
            colors={colors}
            icon="information-circle-outline"
            label={t("version")}
            value="2.0.0"
          />

          <Divider colors={colors} />

          <Row
            colors={colors}
            icon="heart-outline"
            label={t("appName")}
            subtitle={t("appTagline")}
          />
        </View>

        <Text style={styles.footer}>
          {t("footer_mantra")}
        </Text>
      </ScrollView>

      {/* Language Picker */}
      <PickerModal
        visible={showLangSheet}
        title={t("language")}
        colors={colors}
        onClose={() => setShowLangSheet(false)}
        options={[
          {
            key: "en",
            label: t("english"),
          },
          {
            key: "te",
            label: t("telugu"),
          },
          {
            key: "hi",
            label: t("hindi"),
          },
          {
            key: "ta",
            label: t("tamil"),
          },
          {
            key: "kn",
            label: t("kannada"),
          },
        ]}
        selectedKey={lang}
        onSelect={(key) => {
          setLang(key as Language);
          setShowLangSheet(false);
        }}
        testIDPrefix="lang-option"
      />

      {/* Location Picker */}
      <PickerModal
        visible={showLocSheet}
        title={t("location")}
        colors={colors}
        onClose={() => setShowLocSheet(false)}
        options={PRESET_CITIES.map((city) => ({
          key: city.name,
          label: city.name,
        }))}
        selectedKey={location.name}
        onSelect={(key) => {
          const city = PRESET_CITIES.find(
            (item) => item.name === key
          );

          if (city) {
            setLocation(city);
          }

          setShowLocSheet(false);
        }}
        testIDPrefix="loc-option"
      />
    </View>
  );
}

function SectionLabel({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <Text
      style={{
        color: colors.brand,
        fontSize: fontSize.xs,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        fontWeight: "700",
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.xl,
      }}
    >
      {children}
    </Text>
  );
}

function Row({
  colors,
  icon,
  label,
  subtitle,
  value,
  right,
  onPress,
  chevron,
  testID,
}: {
  colors: any;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  value?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  testID?: string;
}) {
  const content = (
    <View style={rowStyles.row}>
      <View
        style={[
          rowStyles.iconWrap,
          {
            backgroundColor:
              colors.brandTertiary,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={colors.brand}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.onSurfaceSecondary,
            fontSize: fontSize.lg,
            fontFamily: fonts.text,
            fontWeight: "600",
          }}
        >
          {label}
        </Text>

        {subtitle ? (
          <Text
            style={{
              color: colors.onSurfaceTertiary,
              fontSize: fontSize.sm,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {value ? (
        <Text
          style={{
            color: colors.onSurfaceTertiary,
            fontSize: fontSize.base,
            marginRight: chevron
              ? spacing.xs
              : 0,
          }}
        >
          {value}
        </Text>
      ) : null}

      {right}

      {chevron && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.onSurfaceTertiary}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        testID={testID}
        android_ripple={{
          color: colors.divider,
        }}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View testID={testID}>
      {content}
    </View>
  );
}

function Divider({
  colors,
}: {
  colors: any;
}) {
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.divider,
        marginLeft: spacing.xl + 36,
      }}
    />
  );
}

function PickerModal({
  visible,
  title,
  options,
  selectedKey,
  onSelect,
  onClose,
  colors,
  testIDPrefix,
}: {
  visible: boolean;
  title: string;
  options: {
    key: string;
    label: string;
  }[];
  selectedKey: string;
  onSelect: (key: string) => void;
  onClose: () => void;
  colors: any;
  testIDPrefix: string;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={modalStyles.backdrop}
        onPress={onClose}
      >
        <Pressable
          style={[
            modalStyles.sheet,
            {
              backgroundColor:
                colors.surfaceSecondary,
            },
          ]}
        >
          <View style={modalStyles.handle} />

          <Text
            style={[
              modalStyles.title,
              {
                color:
                  colors.onSurfaceSecondary,
                fontFamily: fonts.display,
              },
            ]}
          >
            {title}
          </Text>

          {options.map((option) => {
            const selected =
              selectedKey === option.key;

            return (
              <Pressable
                key={option.key}
                onPress={() => {
                  Haptics.selectionAsync().catch(
                    () => {}
                  );
                  onSelect(option.key);
                }}
                style={[
                  modalStyles.option,
                  {
                    borderColor: colors.border,
                  },
                  selected && {
                    borderColor: colors.brand,
                    backgroundColor:
                      "rgba(212,175,55,0.10)",
                  },
                ]}
                testID={`${testIDPrefix}-${option.key}`}
              >
                <Text
                  style={{
                    color:
                      colors.onSurfaceSecondary,
                    fontSize: fontSize.lg,
                    fontWeight: "600",
                  }}
                >
                  {option.label}
                </Text>

                {selected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.brand}
                  />
                )}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  sheet: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl + 20,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#8892B0",
    alignSelf: "center",
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: fontSize.xl,
    marginBottom: spacing.lg,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
});

const makeStyles = (colors: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.surface,
    },

    header: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
    },

    title: {
      fontFamily: fonts.display,
      fontSize: fontSize["3xl"],
      color: colors.onSurface,
    },

    card: {
      marginHorizontal: spacing.xl,
      backgroundColor:
        colors.surfaceSecondary,
      borderRadius: radius.lg,
      borderWidth:
        Platform.OS === "android"
          ? StyleSheet.hairlineWidth
          : 0,
      borderColor: colors.border,
      overflow: "hidden",
    },

    footer: {
      textAlign: "center",
      color: colors.brand,
      fontFamily: fonts.display,
      fontSize: fontSize.lg,
      marginTop: spacing.xxl,
      fontStyle: "italic",
    },
  });