import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addDays, addMinutes, addMonths, isPast, isToday } from "date-fns";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AddReminderModal } from "../components/AddReminderModal";
import { ReminderCard } from "../components/ReminderCard";
import { COLORS } from "../constants/colors";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import {
    cancelReminder,
    scheduleReminder,
    setupNotifications,
} from "../utils/notificationHelper";
import { storeData } from "../utils/storage";

const STORAGE_KEY = "@reminders_v2";

const ReminderScreen = ({ route }) => {
  const { theme } = useTheme();
  const { userData, refreshData } = useData();
  const [modalVisible, setModalVisible] = useState(false);

  const reminders = userData.reminders || [];

  useEffect(() => {
    if (route.params?.openModal) {
      setModalVisible(true);
    }
  }, [route.params]);

  useEffect(() => {
    setupNotifications();
  }, []);

  const saveAndRefresh = async (newReminders) => {
    await storeData(STORAGE_KEY, newReminders);
    await refreshData();
  };

  const addReminder = async (newReminder) => {
    const reminderId = Date.now().toString();
    const triggerDate = new Date(newReminder.time);

    let notificationId = null;
    if (triggerDate > new Date() || newReminder.repeat !== "None") {
      notificationId = await scheduleReminder(
        newReminder.title,
        newReminder.notes,
        triggerDate,
      );
    }

    const reminder = {
      id: reminderId,
      notificationId,
      ...newReminder,
    };

    const updatedReminders = [...reminders, reminder];
    await saveAndRefresh(updatedReminders);
    setModalVisible(false);
  };

  const handleDone = async (id) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    let updated = [...reminders];
    const rIndex = updated.findIndex((r) => r.id === id);
    if (rIndex > -1) {
      const r = updated[rIndex];
      if (r.notificationId) await cancelReminder(r.notificationId);

      if (!r.repeat || r.repeat === "None") {
        updated.splice(rIndex, 1);
      } else {
        let current = new Date(r.time);
        if (r.repeat === "Daily") current = addDays(current, 1);
        else if (r.repeat === "Weekly") current = addDays(current, 7);
        else if (r.repeat === "Monthly") current = addMonths(current, 1);

        r.time = current.toISOString();
        r.notificationId = await scheduleReminder(r.title, r.notes, current);
      }
    }
    await saveAndRefresh(updated);
  };

  const handleSnooze = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Snooze Reminder", "When should we remind you?", [
      { text: "In 10 minutes", onPress: () => snoozeItem(id, 10) },
      { text: "In 1 hour", onPress: () => snoozeItem(id, 60) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const snoozeItem = async (id, minutes) => {
    let updated = [...reminders];
    const rIndex = updated.findIndex((r) => r.id === id);
    if (rIndex > -1) {
      const r = updated[rIndex];
      if (r.notificationId) await cancelReminder(r.notificationId);

      let newTime = addMinutes(new Date(), minutes);
      r.time = newTime.toISOString();
      r.notificationId = await scheduleReminder(r.title, r.notes, newTime);
    }
    await saveAndRefresh(updated);
  };

  // Group Reminders
  const overdue = [];
  const today = [];
  const upcoming = [];

  reminders.forEach((r) => {
    const rTime = new Date(r.time);
    if (isPast(rTime) && !isToday(rTime) && r.repeat === "None") {
      overdue.push(r);
    } else if (isToday(rTime) || r.repeat === "Daily") {
      today.push(r);
    } else {
      upcoming.push(r);
    }
  });

  const sortTime = (a, b) => new Date(a.time) - new Date(b.time);
  overdue.sort(sortTime);
  today.sort(sortTime);
  upcoming.sort(sortTime);

  const isEmpty =
    overdue.length === 0 && today.length === 0 && upcoming.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Dashboard</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your Mind is Clear.
          </Text>
        </View>

        {overdue.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: COLORS.distraction }]}>
              OVERDUE
            </Text>
            {overdue.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onDone={handleDone}
                onSnooze={handleSnooze}
              />
            ))}
          </View>
        )}

        {today.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              TODAY
            </Text>
            {today.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onDone={handleDone}
                onSnooze={handleSnooze}
              />
            ))}
          </View>
        )}

        {upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              UPCOMING
            </Text>
            {upcoming.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onDone={handleDone}
                onSnooze={handleSnooze}
              />
            ))}
          </View>
        )}

        {isEmpty && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="weather-windy"
              size={80}
              color={theme.border}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nothing scheduled.
            </Text>
            <Text style={styles.emptySubtext}>
              Your mind is entirely clear.
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <AddReminderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addReminder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },
  listContent: {
    padding: 24,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: "600",
  },
  emptySubtext: {
    marginTop: 8,
    color: "#888",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.reminder,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.reminder,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
});

export default ReminderScreen;
