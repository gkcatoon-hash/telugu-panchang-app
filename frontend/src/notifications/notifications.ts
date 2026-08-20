import * as Notifications from "expo-notifications";
import { computePanchang, computeSunTimes, formatTime } from "@/src/data/panchang";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleDailyPanchangNotification(lat: number, lon: number, tz: string) {
  try {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    // Cancel existing daily notifications to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Prepare content for today's notification — will be re-evaluated each morning by the app using local scheduling
    const now = new Date();
    const p = computePanchang(now);
    const { sunrise } = computeSunTimes(now, lat, lon);
    const title = `Daily Panchang`;
    const body = `Tithi: ${p.tithi.nameEn} • Nakshatra: ${p.nakshatra.nameEn} • Sunrise ${formatTime(sunrise, tz)}`;

    // Schedule at 6:30 AM local time daily
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { type: "daily-panchang" } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: 6,
        minute: 30,
        repeats: true,
      } as Notifications.NotificationTriggerInput,
    });
  } catch {
    // silently ignore scheduling failures
  }
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
