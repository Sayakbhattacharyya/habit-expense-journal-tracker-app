import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AddHabitModal } from "../components/AddHabitModal";
import { HabitCard } from "../components/habit/HabitCard";
import { HabitInsightsModal } from "../components/habit/HabitInsightsModal";
import { ProgressRing } from "../components/ProgressRing";
import { COLORS } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";
import { generateHabitMicrotext } from "../utils/habitAnalytics";
import { getData, storeData } from "../utils/storage";

const STORAGE_KEY = "@habits_v2";
const HABIT_GROUPS = ["All", "Morning", "Night", "Health", "Learning"];

const HabitScreen = ({ route }) => {
  const { theme } = useTheme();
  const [habits, setHabits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [insightsVisible, setInsightsVisible] = useState(false);
  const [activeGroup, setActiveGroup] = useState("All");

  useEffect(() => {
    if (route.params?.openModal) {
      setModalVisible(true);
    }
  }, [route.params]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  useEffect(() => {
    saveHabits();
  }, [saveHabits]);

  const loadHabits = useCallback(async () => {
    const stored = await getData(STORAGE_KEY);
    if (stored) setHabits(stored);
  }, []);

  const saveHabits = useCallback(async () => {
    await storeData(STORAGE_KEY, habits);
  }, [habits]);

  const addHabit = (newHabit) => {
    const habit = {
      id: Date.now().toString(),
      createDate: new Date().toISOString(),
      ...newHabit,
    };
    setHabits([...habits, habit]);
    setModalVisible(false);
  };

  const toggleHabit = (id) => {
    const today = new Date().toISOString().split("T")[0];
    setHabits(
      habits.map((h) => {
        if (h.id === id) {
          if (h.type === "count") {
            const counts = { ...(h.dailyCounts || {}) };
            let newCount = (counts[today] || 0) + 1;
            if (newCount > h.target) newCount = 0; // reset on wrap around
            counts[today] = newCount;

            let newDates = [...(h.completedDates || [])];
            let newStreak = h.streak || 0;
            if (newCount === h.target) {
              newDates.push(today);
              newStreak += 1;
            } else if (newCount === 0 && newDates.includes(today)) {
              newDates = newDates.filter((d) => d !== today);
              if (newStreak > 0) newStreak -= 1;
            }
            return {
              ...h,
              dailyCounts: counts,
              completedDates: newDates,
              streak: newStreak,
            };
          }

          const isCompleted = h.completedDates?.includes(today);
          let newDates = [...(h.completedDates || [])];
          let newStreak = h.streak || 0;

          if (isCompleted) {
            newDates = newDates.filter((d) => d !== today);
            if (newStreak > 0) newStreak -= 1;
          } else {
            newDates.push(today);
            newStreak += 1;
          }
          return { ...h, completedDates: newDates, streak: newStreak };
        }
        return h;
      }),
    );
  };

  const deleteHabit = (id) => {
    Alert.alert("Delete Habit", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setHabits(habits.filter((h) => h.id !== id)),
      },
    ]);
  };

  // Calculate stats
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];
  const todayDayIndex = todayDate.getDay();

  // Filter habits for today based on frequency schedule and Active Group Focus Mode
  const todaysHabits = habits.filter((h) => {
    // 1. Check Frequency
    let isScheduledToday = false;
    if (!h.frequency)
      isScheduledToday = true; // Legacy fallback
    else if (h.frequency.type === "daily") isScheduledToday = true;
    else if (
      h.frequency.type === "specific" &&
      h.frequency.days.includes(todayDayIndex)
    )
      isScheduledToday = true;

    // 2. Check Focus Mode
    if (!isScheduledToday) return false;
    if (activeGroup === "All") return true;
    return h.group === activeGroup;
  });

  const totalHabits = todaysHabits.length;
  const completedToday = todaysHabits.filter((h) =>
    h.completedDates?.includes(todayStr),
  ).length;

  const progressPercent =
    totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  const motivationalText = generateHabitMicrotext(totalHabits, completedToday);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Dashboard */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.card, shadowColor: theme.text },
        ]}
      >
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text style={[styles.motivationText, { color: theme.text }]}>
            {motivationalText}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setInsightsVisible(true)}
          activeOpacity={0.7}
        >
          <ProgressRing
            progress={progressPercent}
            radius={35}
            stroke={6}
            color={COLORS.habits}
            bg={theme.border}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {HABIT_GROUPS.map((grp) => {
            const isSelected = activeGroup === grp;
            return (
              <TouchableOpacity
                key={grp}
                style={[
                  styles.filterTag,
                  {
                    backgroundColor: isSelected ? theme.text : theme.background,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveGroup(grp);
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: isSelected
                        ? theme.background
                        : theme.textSecondary,
                    },
                  ]}
                >
                  {grp} Focus
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={todaysHabits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onToggle={toggleHabit}
            onLongPress={deleteHabit}
            theme={theme}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="seed-outline"
              size={60}
              color={theme.textSecondary}
              opacity={0.5}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Start your journey.
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Add a habit to track your growth.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={32} color="#fff" />
      </TouchableOpacity>

      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addHabit}
      />
      <HabitInsightsModal
        visible={insightsVisible}
        onClose={() => setInsightsVisible(false)}
        habits={habits}
        theme={theme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingTop: 60, // added padding for top notch
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  motivationText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  filterContainer: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: "#888",
    fontWeight: "500",
  },
  emptySubtext: {
    marginTop: 8,
    color: "#aaa",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#7C3AED", // Vibrant Violet Highlight
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default HabitScreen;
