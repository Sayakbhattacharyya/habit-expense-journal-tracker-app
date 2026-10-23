import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ExerciseCard } from "../components/ExerciseCard";
import { RoutineModal } from "../components/RoutineModal";
import { WorkoutSummaryModal } from "../components/WorkoutSummaryModal";
import { COLORS } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";
import { getData, storeData } from "../utils/storage";

const STORAGE_KEY = "@workouts_v2";
const ROUTINES_KEY = "@workout_routines";

const SUGGESTED_EXERCISES = [
  "Bench Press",
  "Squats",
  "Deadlift",
  "Shoulder Press",
  "Pull Ups",
  "Dumbbell Rows",
  "Bicep Curls",
  "Tricep Extensions",
];

const GymScreen = ({ route }) => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState("dashboard"); // dashboard, active, history
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);

  // Active Workout State
  const [currentWorkout, setCurrentWorkout] = useState({ exercises: [] });
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");

  useEffect(() => {
    if (route.params?.openModal) {
      startWorkout(); // Default empty
    }
  }, [route.params]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const storedWorkouts = await getData(STORAGE_KEY);
    if (storedWorkouts) setWorkouts(storedWorkouts);

    const storedRoutines = await getData(ROUTINES_KEY);
    if (storedRoutines) setRoutines(storedRoutines);
  };

  const saveWorkouts = async (updatedWorkouts) => {
    setWorkouts(updatedWorkouts);
    await storeData(STORAGE_KEY, updatedWorkouts);
  };

  const saveRoutine = async (newRoutine) => {
    const routineWithId = { id: Date.now().toString(), ...newRoutine };
    const updatedRoutines = [...routines, routineWithId];
    setRoutines(updatedRoutines);
    await storeData(ROUTINES_KEY, updatedRoutines);
  };

  const deleteRoutine = async (id) => {
    Alert.alert("Delete Routine", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updatedRoutines = routines.filter((r) => r.id !== id);
          setRoutines(updatedRoutines);
          await storeData(ROUTINES_KEY, updatedRoutines);
        },
      },
    ]);
  };

  // --- Workout Logic ---

  const startWorkout = (routine = null) => {
    let initialExercises = [];

    if (routine) {
      initialExercises = routine.exercises.map((ex) => ({
        id: Date.now().toString() + Math.random(),
        name: ex.name,
        sets: [{ weight: "", reps: "", completed: false }],
      }));
    }

    setCurrentWorkout({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: initialExercises,
      routineId: routine ? routine.id : null,
      routineName: routine ? routine.name : null,
    });
    setWorkoutStartTime(new Date());
    setViewMode("active");
  };

  const addExercise = (name) => {
    if (!name.trim()) return;

    const newExercise = {
      id: Date.now().toString(),
      name: name,
      sets: [{ weight: "", reps: "", completed: false }],
    };

    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
    setNewExerciseName("");
    setShowAddExerciseModal(false);
  };

  const updateSet = (exerciseId, setIndex, field, value) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newSets = [...ex.sets];
          newSets[setIndex] = { ...newSets[setIndex], [field]: value };
          return { ...ex, sets: newSets };
        }
        return ex;
      }),
    }));
  };

  const addSet = (exerciseId) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          const newSet = {
            weight: lastSet ? lastSet.weight : "",
            reps: lastSet ? lastSet.reps : "",
            completed: false,
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      }),
    }));
  };

  const deleteSet = (exerciseId, setIndex) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newSets = ex.sets.filter((_, i) => i !== setIndex);
          return { ...ex, sets: newSets };
        }
        return ex;
      }),
    }));
  };

  const deleteExercise = (exerciseId) => {
    Alert.alert("Remove Exercise", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setCurrentWorkout((prev) => ({
            ...prev,
            exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
          }));
        },
      },
    ]);
  };

  const finishWorkout = () => {
    if (currentWorkout.exercises.length === 0) {
      Alert.alert("Empty Workout", "Add some exercises first!");
      return;
    }

    const endTime = new Date();
    const durationMs = endTime - workoutStartTime;
    const durationMin = Math.round(durationMs / 60000);

    const finishedWorkout = {
      ...currentWorkout,
      endTime: endTime.toISOString(),
      duration: durationMin,
      completed: true,
    };

    const updatedWorkouts = [finishedWorkout, ...workouts];
    saveWorkouts(updatedWorkouts);

    // Show summary
    setShowSummaryModal(true);
  };

  const closeSummary = () => {
    setShowSummaryModal(false);
    setViewMode("dashboard");
    setCurrentWorkout({ exercises: [] });
  };

  // --- Renderers ---

  const renderDashboard = () => {
    const today = new Date();
    const lastWorkout = workouts.length > 0 ? workouts[0] : null;

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dateText}>{format(today, "EEEE, MMM d")}</Text>
          <Text style={styles.greeting}>Push your limits today 🔥</Text>
        </View>

        {/* Streak / Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{workouts.length}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {lastWorkout ? format(new Date(lastWorkout.date), "MMM d") : "-"}
            </Text>
            <Text style={styles.statLabel}>Last Session</Text>
          </View>
        </View>

        {/* Routines Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>My Routines</Text>
          <TouchableOpacity onPress={() => setShowRoutineModal(true)}>
            <Text style={styles.seeAllText}>+ CREATE</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.routinesScroll}
        >
          <TouchableOpacity
            style={styles.createRoutineCard}
            onPress={() => setShowRoutineModal(true)}
          >
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={32}
              color={COLORS.gym}
            />
            <Text style={styles.createRoutineText}>New Routine</Text>
          </TouchableOpacity>

          {routines.map((routine) => (
            <TouchableOpacity
              key={routine.id}
              style={styles.routineCard}
              onPress={() => startWorkout(routine)}
              onLongPress={() => deleteRoutine(routine.id)}
            >
              <MaterialCommunityIcons name="dumbbell" size={24} color="#fff" />
              <Text style={styles.routineTitle}>{routine.name}</Text>
              <Text style={styles.routineSubtitle}>
                {routine.exercises.length} Exercises
              </Text>
              <View style={styles.playButton}>
                <MaterialCommunityIcons
                  name="play"
                  size={16}
                  color={COLORS.gym}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Start Empty Workout Card */}
        <TouchableOpacity
          style={styles.startCard}
          onPress={() => startWorkout()}
        >
          <View style={styles.startContent}>
            <Text style={styles.startTitle}>Start Empty Workout</Text>
            <Text style={styles.startSubtitle}>
              Build your routine as you go
            </Text>
          </View>
          <View style={styles.startIcon}>
            <MaterialCommunityIcons name="plus" size={32} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Recent History</Text>
        {workouts.slice(0, 3).map((workout) => (
          <TouchableOpacity key={workout.id} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <View>
                <Text style={styles.historyDate}>
                  {format(new Date(workout.date), "MMM d, h:mm a")}
                </Text>
                {workout.routineName && (
                  <Text style={styles.historyRoutine}>
                    {workout.routineName}
                  </Text>
                )}
              </View>
              <Text style={styles.historyDuration}>{workout.duration} min</Text>
            </View>
            <Text style={styles.historySummary}>
              {workout.exercises.length} Exercises •{" "}
              {workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)}{" "}
              Sets
            </Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  const renderActiveWorkout = () => (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.activeHeader}>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Cancel Workout", "Are you sure?", [
              { text: "Yes", onPress: () => setViewMode("dashboard") },
              { text: "No" },
            ])
          }
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.timerText}>Workout in Progress</Text>
          {currentWorkout.routineName && (
            <Text style={styles.activeRoutineName}>
              {currentWorkout.routineName}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={finishWorkout}>
          <Text style={styles.finishText}>Finish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.activeContent}>
        {currentWorkout.exercises.length === 0 ? (
          <View style={styles.emptyActive}>
            <Text style={styles.emptyActiveText}>
              Add an exercise to get started
            </Text>
          </View>
        ) : (
          currentWorkout.exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onUpdateSet={updateSet}
              onAddSet={addSet}
              onDeleteSet={deleteSet}
              onDeleteExercise={() => deleteExercise(exercise.id)}
            />
          ))
        )}

        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() => setShowAddExerciseModal(true)}
        >
          <Text style={styles.addExerciseButtonText}>+ Add Exercise</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal visible={showAddExerciseModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Exercise</Text>
              <TouchableOpacity onPress={() => setShowAddExerciseModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Exercise Name"
              value={newExerciseName}
              onChangeText={setNewExerciseName}
              autoFocus
            />

            <Text style={styles.suggestionTitle}>Suggestions</Text>
            <View style={styles.suggestionsContainer}>
              {SUGGESTED_EXERCISES.map((ex) => (
                <TouchableOpacity
                  key={ex}
                  style={styles.suggestionChip}
                  onPress={() => addExercise(ex)}
                >
                  <Text style={styles.suggestionText}>{ex}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={() => addExercise(newExerciseName)}
            >
              <Text style={styles.modalAddButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {viewMode === "dashboard" ? renderDashboard() : renderActiveWorkout()}

      <WorkoutSummaryModal
        visible={showSummaryModal}
        workout={workouts[0]} // Most recent
        onClose={closeSummary}
      />

      <RoutineModal
        visible={showRoutineModal}
        onClose={() => setShowRoutineModal(false)}
        onSave={saveRoutine}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.gym,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: "#f0f0f0",
  },
  startCard: {
    backgroundColor: COLORS.gym,
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    shadowColor: COLORS.gym,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  startSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  startIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gym,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  historyDuration: {
    color: "#666",
    fontSize: 14,
  },
  historySummary: {
    color: "#999",
    fontSize: 14,
  },
  // Active Workout Styles
  activeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cancelText: {
    color: "#FF5252",
    fontSize: 16,
  },
  timerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  finishText: {
    color: COLORS.gym,
    fontWeight: "bold",
    fontSize: 16,
  },
  activeContent: {
    padding: 16,
  },
  addExerciseButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gym,
    borderStyle: "dashed",
  },
  addExerciseButtonText: {
    color: COLORS.gym,
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyActive: {
    alignItems: "center",
    marginVertical: 40,
  },
  emptyActiveText: {
    color: "#999",
    fontSize: 16,
  },
  // Modal Styles
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
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    marginBottom: 24,
  },
  suggestionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    color: "#666",
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  suggestionChip: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    color: "#333",
  },
  modalAddButton: {
    backgroundColor: COLORS.gym,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: "auto",
  },
  modalAddButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default GymScreen;
