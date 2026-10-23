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
import { useTheme } from "../context/ThemeContext";

const ICONS = [
  "run",
  "book-open-variant",
  "water",
  "meditation",
  "sleep",
  "dumbbell",
  "food-apple",
  "code-tags",
];
const COLORS_PICKER = [
  "#FF8A80",
  "#B388FF",
  "#8C9EFF",
  "#80D8FF",
  "#A7FFEB",
  "#CCFF90",
  "#FFFF8D",
  "#FFD180",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HABIT_GROUPS = ["None", "Morning", "Night", "Health", "Learning"];

export const AddHabitModal = ({ visible, onClose, onSave }) => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS_PICKER[1]);

  // New properties
  const [habitType, setHabitType] = useState("binary"); // 'binary', 'count', 'time', 'avoid'
  const [frequency, setFrequency] = useState("daily"); // 'daily', 'specific'
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [targetCount, setTargetCount] = useState("1");
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00 AM");
  const [selectedGroup, setSelectedGroup] = useState(HABIT_GROUPS[0]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name,
      icon: selectedIcon,
      color: selectedColor,
      type: habitType,
      target: habitType === "count" ? parseInt(targetCount, 10) || 1 : null,
      frequency: {
        type: frequency,
        days: frequency === "specific" ? selectedDays : [0, 1, 2, 3, 4, 5, 6],
      },
      reminder: enableReminder
        ? { enabled: true, time: reminderTime }
        : { enabled: false },
      group: selectedGroup === "None" ? null : selectedGroup,
      streak: 0,
      completedDates: [], // Backwards compatibility for now, will refactor how completetion tracks count later
    });
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setSelectedIcon(ICONS[0]);
    setSelectedColor(COLORS_PICKER[1]);
    setHabitType("binary");
    setFrequency("daily");
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    setTargetCount("1");
    setEnableReminder(false);
    setReminderTime("09:00 AM");
    setSelectedGroup(HABIT_GROUPS[0]);
  };

  const toggleDay = (index) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter((d) => d !== index));
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={[styles.container, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              New Habit
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Habit Name
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text },
              ]}
              placeholder="e.g. Read 10 minutes"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Habit Type
            </Text>
            <View style={styles.typeRow}>
              {["binary", "count", "avoid"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeBtn,
                    { borderColor: theme.border },
                    habitType === type && {
                      backgroundColor: selectedColor,
                      borderColor: selectedColor,
                    },
                  ]}
                  onPress={() => setHabitType(type)}
                >
                  <Text
                    style={[
                      styles.typeTxt,
                      { color: theme.textSecondary },
                      habitType === type && {
                        color: "#000",
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {habitType === "count" && (
              <View style={styles.targetRow}>
                <Text
                  style={[
                    styles.label,
                    { color: theme.textSecondary, marginTop: 0 },
                  ]}
                >
                  Daily Target:
                </Text>
                <TextInput
                  style={[
                    styles.countInput,
                    { backgroundColor: theme.background, color: theme.text },
                  ]}
                  keyboardType="numeric"
                  value={targetCount}
                  onChangeText={setTargetCount}
                  maxLength={4}
                />
              </View>
            )}

            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Frequency
            </Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  { borderColor: theme.border },
                  frequency === "daily" && {
                    backgroundColor: selectedColor,
                    borderColor: selectedColor,
                  },
                ]}
                onPress={() => setFrequency("daily")}
              >
                <Text
                  style={[
                    styles.typeTxt,
                    { color: theme.textSecondary },
                    frequency === "daily" && {
                      color: "#000",
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Daily
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  { borderColor: theme.border },
                  frequency === "specific" && {
                    backgroundColor: selectedColor,
                    borderColor: selectedColor,
                  },
                ]}
                onPress={() => setFrequency("specific")}
              >
                <Text
                  style={[
                    styles.typeTxt,
                    { color: theme.textSecondary },
                    frequency === "specific" && {
                      color: "#000",
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Specific Days
                </Text>
              </TouchableOpacity>
            </View>

            {frequency === "specific" && (
              <View style={styles.daysRow}>
                {DAYS.map((day, ix) => {
                  const isSelected = selectedDays.includes(ix);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayBtn,
                        { borderColor: theme.border },
                        isSelected && {
                          backgroundColor: selectedColor,
                          borderColor: selectedColor,
                        },
                      ]}
                      onPress={() => toggleDay(ix)}
                    >
                      <Text
                        style={[
                          styles.dayTxt,
                          { color: theme.textSecondary },
                          isSelected && { color: "#000", fontWeight: "bold" },
                        ]}
                      >
                        {day[0]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Icon
            </Text>
            <View style={styles.row}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconBtn,
                    { backgroundColor: theme.background },
                    selectedIcon === icon && { backgroundColor: selectedColor },
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <MaterialCommunityIcons
                    name={icon}
                    size={24}
                    color={selectedIcon === icon ? "#fff" : theme.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Routine / Group
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.groupRow}
            >
              {HABIT_GROUPS.map((grp) => (
                <TouchableOpacity
                  key={grp}
                  style={[
                    styles.groupBtn,
                    selectedGroup === grp && {
                      backgroundColor: selectedColor,
                      borderColor: selectedColor,
                    },
                  ]}
                  onPress={() => setSelectedGroup(grp)}
                >
                  <Text
                    style={[
                      styles.groupTxt,
                      { color: theme.textSecondary },
                      selectedGroup === grp && {
                        color: "#000",
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {grp}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Color
            </Text>
            <View style={styles.row}>
              {COLORS_PICKER.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorBtn,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color="#000"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.reminderSection}>
              <View style={styles.reminderHeader}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: theme.textSecondary,
                      marginTop: 0,
                      marginBottom: 0,
                    },
                  ]}
                >
                  Gentle Reminder
                </Text>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    enableReminder && {
                      backgroundColor: selectedColor,
                      borderColor: selectedColor,
                    },
                  ]}
                  onPress={() => setEnableReminder(!enableReminder)}
                >
                  <View
                    style={[
                      styles.toggleKnob,
                      enableReminder && styles.toggleKnobActive,
                    ]}
                  />
                </TouchableOpacity>
              </View>
              {enableReminder && (
                <View style={styles.reminderTimeRow}>
                  <Text style={{ color: theme.textSecondary }}>Time</Text>
                  <TouchableOpacity style={styles.timeTag}>
                    <Text style={{ fontWeight: "bold" }}>{reminderTime}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: selectedColor }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Create Habit</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 12, marginTop: 16 },
  input: { padding: 16, borderRadius: 12, fontSize: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  colorBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: { borderWidth: 2, borderColor: "#000" },
  saveButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 32,
  },
  saveButtonText: { color: "#000", fontSize: 18, fontWeight: "bold" },
  typeRow: { flexDirection: "row", gap: 10 },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  typeTxt: { fontSize: 14, fontWeight: "500" },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  dayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayTxt: { fontSize: 14 },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    justifyContent: "space-between",
  },
  countInput: {
    width: 100,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    textAlign: "center",
  },
  reminderSection: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#00000008",
  },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleBtn: {
    width: 50,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#eee",
    padding: 2,
    justifyContent: "center",
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleKnobActive: { transform: [{ translateX: 22 }] },
  reminderTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#00000010",
  },
  timeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#00000010",
  },
  groupRow: { paddingVertical: 8, gap: 10, paddingRight: 20 },
  groupBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  groupTxt: { fontSize: 13, fontWeight: "500" },
});
