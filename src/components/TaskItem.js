import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onToggle(task.id)}
        style={styles.content}
      >
        <MaterialCommunityIcons
          name={task.completed ? "checkbox-marked" : "checkbox-blank-outline"}
          size={24}
          color={task.completed ? "#4CAF50" : "#757575"}
        />
        <Text style={[styles.text, task.completed && styles.completedText]}>
          {task.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        style={styles.deleteButton}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color="#F44336"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9e9e9e",
  },
  deleteButton: {
    padding: 4,
  },
});

export default TaskItem;
