import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const TaskCard = ({ task, onToggle, styles: customStyles }) => {
  // Generate soft background color based on task color/status
  const getBackgroundColor = (color, completed) => {
    if (completed) return "#f5f5f5"; // Greyed out
    // Simple map for pastel variations or use opacity
    switch (color) {
      case "#FF9800":
        return "#FFF3E0"; // Orange -> Light Orange
      case "#2196F3":
        return "#E3F2FD"; // Blue -> Light Blue
      case "#4CAF50":
        return "#E8F5E9"; // Green -> Light Green
      case "#9C27B0":
        return "#F3E5F5"; // Purple -> Light Purple
      default:
        return "#FFEBEE"; // Default pinkish
    }
  };

  const bgColor = getBackgroundColor(task.color, task.completed);
  const timeColor = task.completed ? "#bdbdbd" : "#757575";
  const textColor = task.completed ? "#9e9e9e" : "#333";

  return (
    <View style={[styles.container, customStyles]}>
      {/* Left Time Connector */}
      <View style={styles.connector}>
        <View
          style={[
            styles.circleIcon,
            { backgroundColor: task.color || "#FF8A80" },
          ]}
        >
          <MaterialCommunityIcons
            name={task.icon || "checkbox-blank-circle-outline"}
            size={20}
            color="#fff"
          />
        </View>
        <View style={styles.line} />
      </View>

      {/* Right Content Card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: bgColor }]}
        onPress={() => onToggle(task.id)}
      >
        <View style={styles.timeRow}>
          <Text style={[styles.timeText, { color: timeColor }]}>
            {task.startTime} - {task.endTime} • {task.duration} min
          </Text>
          <MaterialCommunityIcons
            name={
              task.completed
                ? "checkbox-marked-circle"
                : "checkbox-blank-circle-outline"
            }
            size={20}
            color={task.completed ? "#bdbdbd" : task.color || "#FF8A80"}
          />
        </View>

        <Text
          style={[
            styles.title,
            {
              color: textColor,
              textDecorationLine: task.completed ? "line-through" : "none",
            },
          ]}
        >
          {task.title}
        </Text>

        {task.notes && (
          <Text style={[styles.notes, { color: timeColor }]} numberOfLines={1}>
            {task.notes}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  connector: {
    alignItems: "center",
    marginRight: 12,
    width: 40,
  },
  circleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: "#E0E0E0",
    marginTop: -4,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
  },
});
