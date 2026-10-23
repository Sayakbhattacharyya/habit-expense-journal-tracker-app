import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { COLORS } from "../constants/colors";

export const HabitCard = ({ habit, onToggle, onLongPress }) => {
  // Check if completed today
  const today = new Date().toISOString().split("T")[0];
  const isCompleted =
    habit.completedDates && habit.completedDates.includes(today);

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.completedCard]}
      onLongPress={() => onLongPress(habit.id)}
      activeOpacity={0.8}
      onPress={() => onToggle(habit.id)}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isCompleted ? "#fff" : habit.color + "20" },
        ]}
      >
        <MaterialCommunityIcons
          name={habit.icon || "star"}
          size={24}
          color={isCompleted ? habit.color : habit.color}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, isCompleted && styles.completedText]}>
          {habit.name}
        </Text>
        <View style={styles.streakContainer}>
          <MaterialCommunityIcons
            name="fire"
            size={14}
            color={isCompleted ? "#fff" : COLORS.textLight}
          />
          <Text
            style={[styles.streakText, isCompleted && styles.completedText]}
          >
            {habit.streak || 0} day streak
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.checkbox,
          isCompleted && styles.checkedBox,
          { borderColor: habit.color },
        ]}
      >
        {isCompleted && (
          <MaterialCommunityIcons name="check" size={20} color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: COLORS.habits, // Use main habit color or dynamic
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  completedText: {
    color: "#fff",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderColor: "#fff",
  },
});
