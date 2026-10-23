import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AddTaskModal } from "../components/AddTaskModal";
import { DateScroller } from "../components/DateScroller";
import { TaskCard } from "../components/TaskCard";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { timeToMinutes } from "../utils/dateUtils";
import { storeData } from "../utils/storage";

const STORAGE_KEY = "@todos_timeline";

const TodoScreen = ({ route }) => {
  const { theme } = useTheme();
  const { userData, refreshData } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  // Use tasks from global context
  const tasks = userData.todos || [];

  useEffect(() => {
    if (route.params?.openModal) {
      setModalVisible(true);
    }
  }, [route.params]);

  const saveAndRefresh = async (newTasks) => {
    await storeData(STORAGE_KEY, newTasks);
    await refreshData();
  };

  const addTask = async (newTask) => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const taskWithId = {
      id: Date.now().toString(),
      date: dateStr,
      completed: false,
      ...newTask,
    };
    const updatedTasks = [...tasks, taskWithId];
    await saveAndRefresh(updatedTasks);
  };

  const toggleTask = async (id) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    await saveAndRefresh(updatedTasks);
  };

  // Filter tasks for selected date
  const currentTasks = tasks.filter(
    (t) => t.date === format(selectedDate, "yyyy-MM-dd"),
  );

  // Sort tasks by time
  const sortedTasks = [...currentTasks].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header / Date Scroller */}
      <DateScroller
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Timeline View */}
        <View style={styles.timelineContainer}>
          {sortedTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="calendar-blank"
                size={60}
                color="#e0e0e0"
              />
              <Text style={styles.emptyText}>
                Plan your day to bring clarity.
              </Text>
            </View>
          ) : (
            sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={toggleTask} />
            ))
          )}

          {/* Visual Line ending (optional) */}
          <View style={styles.timelineEnd} />
        </View>

        {/* Bottom Padding for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Internal Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  timelineContainer: {
    paddingTop: 20,
    minHeight: 400,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
  timelineEnd: {
    height: 50,
    borderLeftWidth: 2,
    borderColor: "#f0f0f0",
    marginLeft: 36, // Align with line in TaskCard
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4facfe", // Todo Blue
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
});

export default TodoScreen;
