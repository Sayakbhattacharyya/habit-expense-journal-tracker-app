import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../constants/colors";

export const ExerciseSetRow = ({
  setNumber,
  weight,
  reps,
  completed,
  onUpdate,
  onDelete,
}) => {
  return (
    <View style={[styles.container, completed && styles.completedRow]}>
      <View style={styles.setNumberContainer}>
        <Text style={styles.setNumber}>{setNumber}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="kg"
          value={weight}
          onChangeText={(text) => onUpdate("weight", text)}
          keyboardType="numeric"
          editable={!completed}
        />
        <Text style={styles.unit}>kg</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="reps"
          value={reps}
          onChangeText={(text) => onUpdate("reps", text)}
          keyboardType="numeric"
          editable={!completed}
        />
        <Text style={styles.unit}>reps</Text>
      </View>

      <TouchableOpacity
        style={[styles.checkButton, completed && styles.completedCheck]}
        onPress={() => onUpdate("completed", !completed)}
      >
        <MaterialCommunityIcons
          name="check"
          size={20}
          color={completed ? "#fff" : COLORS.textLight}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  completedRow: {
    backgroundColor: "#E8F5E9",
  },
  setNumberContainer: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  setNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textLight,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 8,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    textAlign: "center",
    fontWeight: "600",
  },
  unit: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  completedCheck: {
    backgroundColor: COLORS.gym,
  },
});
