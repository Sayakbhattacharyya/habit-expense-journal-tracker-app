import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SettingsCard } from "../components/profile/SettingsCard";
import { ToggleRow } from "../components/profile/ToggleRow";
import { useTheme } from "../context/ThemeContext";

const NOTIFICATIONS_KEY = "@settings_notifications";
const HAPTICS_KEY = "@settings_haptics";

const ProfileScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const loadSettings = async () => {
    try {
      const storedNotifs = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (storedNotifs !== null) {
        setNotificationsEnabled(JSON.parse(storedNotifs));
      }

      const storedHaptics = await AsyncStorage.getItem(HAPTICS_KEY);
      if (storedHaptics !== null) {
        setHapticsEnabled(JSON.parse(storedHaptics));
      }
    } catch (error) {
      console.error("Failed to load settings", error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(value));
  };

  const toggleHaptics = async (value) => {
    setHapticsEnabled(value);
    await AsyncStorage.setItem(HAPTICS_KEY, JSON.stringify(value));
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Profile Header */}
      <View style={styles.headerContainer}>
        <View
          style={[
            styles.avatarContainer,
            {
              borderColor: theme.border,
              backgroundColor: theme.card,
              shadowColor: isDark ? theme.primary : "#000",
              shadowOpacity: isDark ? 0.05 : 0.1,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="account"
            size={64}
            color={theme.primary}
          />
        </View>
        <Text style={[styles.userName, { color: theme.text }]}>Sayak</Text>
        <Text style={[styles.userHandle, { color: theme.textSecondary }]}>
          @sayak_dev
        </Text>
      </View>

      <View style={[styles.headerDivider, { backgroundColor: theme.border }]} />

      {/* Settings Card */}
      <SettingsCard>
        <ToggleRow
          icon="bell-ring-outline"
          label="Notifications"
          description="Receive reminders and important updates"
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
        <ToggleRow
          icon="vibrate"
          label="Haptics"
          description="Feel subtle vibrations for actions and completion"
          value={hapticsEnabled}
          onValueChange={toggleHaptics}
        />
        <ToggleRow
          icon="theme-light-dark"
          label="Dark Mode"
          description="Switch between light and dark appearance"
          value={isDark}
          onValueChange={toggleTheme}
          showDivider={false}
        />
      </SettingsCard>

      {/* Bottom Padding */}
      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1,
  },
  headerDivider: {
    height: 1,
    marginHorizontal: 40,
    opacity: 0.5,
  },
});

export default ProfileScreen;
