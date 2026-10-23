import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export const AddTaskModal = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState("30"); // minutes
  const [selectedIcon, setSelectedIcon] = useState("briefcase-outline");

  // Simple color selection (could be expanded)
  const [selectedColor, setSelectedColor] = useState("#FF8A80"); // Coral

  const handleSave = () => {
    if (!title.trim()) return;

    // Calculate End Time
    const [hours, mins] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, mins, 0);
    const endDate = new Date(startDate.getTime() + duration * 60000);

    const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;

    onSave({
      title,
      notes,
      startTime,
      endTime,
      duration,
      color: selectedColor,
      icon: selectedIcon,
    });

    // Reset
    setTitle("");
    setNotes("");
    setStartTime("09:00");
    onClose();
  };

  const icons = [
    "format-list-checks",
    "phone",
    "email",
    "account",
    "cart",
    "book-open-page-variant",
    "briefcase",
    "dumbbell",
    "run",
    "yoga",
    "silverware-fork-knife",
    "cup-water",
    "pill",
    "stethoscope",
    "airplane",
    "car",
    "train",
    "bus",
    "home",
    "broom",
    "washing-machine",
    "baby-carriage",
    "paw",
    "controller-classic",
    "music-note",
    "palette",
    "camera",
    "gift",
    "alert-circle-outline",
    "check-circle-outline",
    "clock-outline",
    "calendar",
  ];
  const colors = [
    "#FF8A80",
    "#FF9800",
    "#4CAF50",
    "#2196F3",
    "#9C27B0",
    "#795548",
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <TextInput
              style={styles.titleInput}
              placeholder="What needs to be done?"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Start Time (HH:MM)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="09:00"
                  value={startTime}
                  onChangeText={setStartTime}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Duration (min)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="30"
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.label}>Icon</Text>
            <View style={styles.selectionRow}>
              {icons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    selectedIcon === icon && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <MaterialCommunityIcons
                    name={icon}
                    size={24}
                    color={selectedIcon === icon ? "#fff" : "#666"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Color</Text>
            <View style={styles.selectionRow}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorOption,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Add notes..."
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: selectedColor }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Schedule Task</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  halfInput: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  selectionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: "#333",
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    marginBottom: 12,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: "#333",
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
