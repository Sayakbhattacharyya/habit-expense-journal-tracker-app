import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
import { COLORS } from "../constants/colors";
import { ExerciseSetRow } from "./ExerciseSetRow";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const ExerciseCard = ({
  exercise,
  onUpdateSet,
  onAddSet,
  onDeleteSet,
  onDeleteExercise,
}) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{exercise.name}</Text>
          {exercise.sets && exercise.sets.length > 0 && !expanded && (
            <Text style={styles.summaryText}>
              {exercise.sets.length} sets •{" "}
              {exercise.sets.filter((s) => s.completed).length} done
            </Text>
          )}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={onDeleteExercise}
            style={styles.deleteButton}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="#FF5252"
            />
          </TouchableOpacity>
          <MaterialCommunityIcons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={COLORS.textLight}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <View style={styles.labels}>
            <Text style={[styles.label, { width: 40 }]}>Set</Text>
            <Text style={[styles.label, { flex: 1 }]}>kg</Text>
            <Text style={[styles.label, { flex: 1 }]}>Reps</Text>
            <Text style={[styles.label, { width: 50 }]}>Done</Text>
          </View>

          {exercise.sets &&
            exercise.sets.map((set, index) => (
              <ExerciseSetRow
                key={index}
                setNumber={index + 1}
                weight={set.weight}
                reps={set.reps}
                completed={set.completed}
                onUpdate={(field, value) =>
                  onUpdateSet(exercise.id, index, field, value)
                }
                onDelete={() => onDeleteSet(exercise.id, index)}
              />
            ))}

          <TouchableOpacity
            style={styles.addSetButton}
            onPress={() => onAddSet(exercise.id)}
          >
            <MaterialCommunityIcons name="plus" size={16} color={COLORS.gym} />
            <Text style={styles.addSetText}> Add Set</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  summaryText: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginRight: 16,
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  labels: {
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  addSetButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#90CAF9",
  },
  addSetText: {
    color: COLORS.gym,
    fontWeight: "bold",
    fontSize: 14,
  },
});
