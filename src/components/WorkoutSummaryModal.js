import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";

export const WorkoutSummaryModal = ({ visible, workout, onClose }) => {
  if (!workout) return null;

  const totalExercises = workout.exercises ? workout.exercises.length : 0;

  // Calculate total sets completed
  const totalSets = workout.exercises
    ? workout.exercises.reduce((acc, ex) => {
        return (
          acc + (ex.sets ? ex.sets.filter((s) => s && s.completed).length : 0)
        );
      }, 0)
    : 0;

  // Calculate total volume
  const totalVolume = workout.exercises
    ? workout.exercises.reduce((acc, ex) => {
        if (!ex.sets) return acc;
        return (
          acc +
          ex.sets.reduce((sAcc, set) => {
            if (set && set.completed) {
              const weight = parseFloat(set.weight) || 0;
              const reps = parseFloat(set.reps) || 0;
              return sAcc + weight * reps;
            }
            return sAcc;
          }, 0)
        );
      }, 0)
    : 0;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="trophy" size={50} color="#FFC107" />
          </View>
          <Text style={styles.title}>Great Job! 💪</Text>
          <Text style={styles.subtitle}>Workout Complete</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalExercises}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalSets}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {totalVolume.toLocaleString()}kg
              </Text>
              <Text style={styles.statLabel}>Volume</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: "#FFF8E1",
    padding: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.gym,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  button: {
    backgroundColor: COLORS.gym,
    paddingVertical: 16,
    width: "100%",
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
