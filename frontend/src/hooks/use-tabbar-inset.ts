import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

/**
 * Bottom-inset padding for scroll content inside a Tab.Screen so the last
 * item never sits behind the (absolute-positioned) tab bar on Android
 * edge-to-edge devices or iOS home-indicator phones.
 */
export function useTabBarBottomPadding(extra = 24) {
  const height = useBottomTabBarHeight();
  return height + extra;
}
