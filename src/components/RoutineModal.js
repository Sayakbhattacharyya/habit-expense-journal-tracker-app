import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../constants/colors";

const SUGGESTED_EXERCISES = [
  "Bench Press",
  "Squats",
  "Deadlift",
  "Shoulder Press",
  "Pull Ups",
  "Dumbbell Rows",
  "Bicep Curls",
  "Tricep Extensions",
  "Leg Press",
  "Lunges",
  "Lat Pulldown",
  "Face Pulls",
  "Lateral Raises",
  "Calf Raises",
  "Plank",
  "Crunches",
];

export const RoutineModal = ({ visible, onClose, onSave }) => {
  const [routineName, setRoutineName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [customExercise, setCustomExercise] = useState("");

  const toggleExercise = (exercise) => {
    if (selectedExercises.includes(exercise)) {
      setSelectedExercises(selectedExercises.filter((e) => e !== exercise));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const addCustomExercise = () => {
    if (customExercise.trim()) {
      setSelectedExercises([...selectedExercises, customExercise.trim()]);
      setCustomExercise("");
    }
  };

  const handleSave = () => {
    if (!routineName.trim() || selectedExercises.length === 0) return;

    onSave({
      name: routineName,
      exercises: selectedExercises.map((e) => ({
        name: e,
        sets: [{ weight: "", reps: "", completed: false }], // Default set structure
      })),
    });

    // Reset
    setRoutineName("");
    setSelectedExercises([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Create Routine</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Routine Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Push Day, Leg Day"
              value={routineName}
              onChangeText={setRoutineName}
            />

            <Text style={styles.label}>Add Exercises</Text>
            <View style={styles.addCustomContainer}>
              <TextInput
                style={[styles.input, styles.customInput]}
                placeholder="Custom Exercise"
                value={customExercise}
                onChangeText={setCustomExercise}
              />
              <TouchableOpacity
                style={styles.addCustomBtn}
                onPress={addCustomExercise}
              >
                <MaterialCommunityIcons name="plus" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Select from List</Text>
            <View style={styles.exercisesGrid}>
              {SUGGESTED_EXERCISES.map((ex) => (
                <TouchableOpacity
                  key={ex}
                  style={[
                    styles.exerciseChip,
                    selectedExercises.includes(ex) && styles.selectedChip,
                  ]}
                  onPress={() => toggleExercise(ex)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedExercises.includes(ex) && styles.selectedChipText,
                    ]}
                  >
                    {ex}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedExercises.length > 0 && (
              <View style={styles.selectedList}>
                <Text style={styles.label}>
                  Selected ({selectedExercises.length})
                </Text>
                {selectedExercises.map((ex, index) => (
                  <View key={index} style={styles.selectedItem}>
                    <Text style={styles.selectedItemText}>{ex}</Text>
                    <TouchableOpacity onPress={() => toggleExercise(ex)}>
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={20}
                        color="#ff5252"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!routineName.trim() || selectedExercises.length === 0) &&
                styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={!routineName.trim() || selectedExercises.length === 0}
          >
            <Text style={styles.saveButtonText}>Save Routine</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    height: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
  },
  addCustomContainer: {
    flexDirection: "row",
    gap: 12,
  },
  customInput: {
    flex: 1,
  },
  addCustomBtn: {
    backgroundColor: COLORS.gym,
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  exercisesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exerciseChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedChip: {
    backgroundColor: COLORS.gym + "20", // 20% opacity
    borderColor: COLORS.gym,
  },
  chipText: {
    color: "#666",
    fontSize: 14,
  },
  selectedChipText: {
    color: COLORS.gym,
    fontWeight: "600",
  },
  selectedList: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  selectedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedItemText: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: COLORS.gym,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
