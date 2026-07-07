import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { useLang } from "@/src/i18n/LanguageContext";
import { useTheme } from "@/src/theme/ThemeContext";

export default function TabsLayout() {
  const { colors, isDark } = useTheme();
  const { t } = useLang();

  const iconFor = (name: string, focused: boolean, color: string) => (
    <Ionicons name={name as any} size={focused ? 24 : 22} color={color} />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: isDark ? "#8892B0" : "#6B7A99",
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginBottom: 4 },
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === "ios" ? 84 : 68,
          paddingTop: 8,
          backgroundColor: "transparent",
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              intensity={Platform.OS === "ios" ? 60 : 90}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: isDark
                    ? "rgba(6,11,25,0.85)"
                    : "rgba(255,255,255,0.85)",
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                },
              ]}
            />
          </View>
        ),
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.selectionAsync().catch(() => {});
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tab_home"),
          tabBarIcon: ({ color, focused }) => iconFor(focused ? "home" : "home-outline", focused, color),
          tabBarButtonTestID: "tab-home",
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t("tab_calendar"),
          tabBarIcon: ({ color, focused }) => iconFor(focused ? "calendar" : "calendar-outline", focused, color),
          tabBarButtonTestID: "tab-calendar",
        }}
      />
      <Tabs.Screen
        name="festivals"
        options={{
          title: t("tab_festivals"),
          tabBarIcon: ({ color, focused }) => iconFor(focused ? "sparkles" : "sparkles-outline", focused, color),
          tabBarButtonTestID: "tab-festivals",
        }}
      />
      <Tabs.Screen
        name="devotion"
        options={{
          title: t("tab_devotion"),
          tabBarIcon: ({ color, focused }) => iconFor(focused ? "flower" : "flower-outline", focused, color),
          tabBarButtonTestID: "tab-devotion",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tab_settings"),
          tabBarIcon: ({ color, focused }) => iconFor(focused ? "settings" : "settings-outline", focused, color),
          tabBarButtonTestID: "tab-settings",
        }}
      />
    </Tabs>
  );
}
