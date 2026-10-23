import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    addDays,
    addHours,
    addMinutes,
    format,
    setHours,
    setMinutes,
} from "date-fns";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";

const QUICK_TIMES = ["In 10 Min", "In 1 Hour", "Tonight", "Tomorrow Morning"];
const REPEAT_OPTIONS = ["None", "Daily", "Weekly", "Monthly"];
const PRIORITY_OPTIONS = ["Low", "Normal", "Important"];

export const AddReminderModal = ({ visible, onClose, onSave }) => {
  const { theme, isDark } = useTheme();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState(new Date());
  const [repeat, setRepeat] = useState("None");
  const [priority, setPriority] = useState("Normal");
  const [showPicker, setShowPicker] = useState(false);
  const [activeQuickTime, setActiveQuickTime] = useState(null);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, notes, time: time.toISOString(), repeat, priority });
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setNotes("");
    setTime(new Date());
    setRepeat("None");
    setPriority("Normal");
    setActiveQuickTime(null);
  };

  const onTimeChange = (event, selectedTime) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedTime) {
      setTime(selectedTime);
      setActiveQuickTime(null);
    }
  };

  const handleQuickTime = (option) => {
    setActiveQuickTime(option);
    const now = new Date();
    let newTime = new Date();

    if (option === "In 10 Min") {
      newTime = addMinutes(now, 10);
    } else if (option === "In 1 Hour") {
      newTime = addHours(now, 1);
    } else if (option === "Tonight") {
      newTime = setMinutes(setHours(now, 20), 0); // 8 PM
      if (newTime < now) newTime = addDays(newTime, 1);
    } else if (option === "Tomorrow Morning") {
      newTime = setMinutes(setHours(addDays(now, 1), 9), 0); // 9 AM tomorrow
    }
    setTime(newTime);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView
        intensity={theme.blurTint === "dark" ? 40 : 80}
        tint={theme.blurTint}
        style={styles.overlay}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.card,
              shadowColor: isDark ? theme.primary : "#000",
              shadowOpacity: isDark ? 0.05 : 0.1,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              New Reminder
            </Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              style={[
                styles.input,
                styles.titleInput,
                { color: theme.text, borderColor: theme.border },
              ]}
              placeholder="What do you need to remember?"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Quick Time
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScroll}
            >
              {QUICK_TIMES.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                    activeQuickTime === opt && {
                      backgroundColor: `${COLORS.reminder}20`,
                      borderColor: COLORS.reminder,
                    },
                  ]}
                  onPress={() => handleQuickTime(opt)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color:
                          activeQuickTime === opt
                            ? COLORS.reminder
                            : theme.text,
                      },
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.timeRow}>
              <Text
                style={[
                  styles.label,
                  { color: theme.textSecondary, marginTop: 0 },
                ]}
              >
                Specific Time
              </Text>
              {Platform.OS === "android" && (
                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={[styles.timeButtonText, { color: theme.text }]}>
                    {format(time, "MMM d, h:mm a")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {(showPicker || Platform.OS === "ios") && (
              <DateTimePicker
                testID="dateTimePicker"
                value={time}
                mode="datetime"
                is24Hour={false}
                display="spinner"
                onChange={onTimeChange}
                style={styles.picker}
                textColor={theme.text}
              />
            )}

            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Priority
            </Text>
            <View style={styles.chipsContainer}>
              {PRIORITY_OPTIONS.map((opt) => {
                let color = theme.text;
                if (opt === "Important")
                  color = "#FF3B30"; // iOS Red
                else if (opt === "Low") color = "#34C759"; // iOS Green

                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                      },
                      priority === opt && {
                        backgroundColor: `${color}20`,
                        borderColor: color,
                      },
                    ]}
                    onPress={() => setPriority(opt)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: priority === opt ? color : theme.text },
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Repeat
            </Text>
            <View style={styles.chipsContainer}>
              {REPEAT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                    repeat === opt && {
                      backgroundColor: `${COLORS.reminder}20`,
                      borderColor: COLORS.reminder,
                    },
                  ]}
                  onPress={() => setRepeat(opt)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: repeat === opt ? COLORS.reminder : theme.text },
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Notes (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  color: theme.text,
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Any details..."
              placeholderTextColor={theme.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <View style={{ height: 40 }} />
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveButton, { opacity: title.trim() ? 1 : 0.5 }]}
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text style={styles.saveButtonText}>Set Reminder</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    height: "90%",
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    borderRadius: 0,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    borderWidth: 1,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  picker: {
    height: 120,
    marginBottom: 10,
  },
  chipsScroll: {
    flexDirection: "row",
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8, // for horizontal scroll
  },
  chipText: {
    fontWeight: "600",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: COLORS.reminder,
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 16,
    marginBottom: Platform.OS === "ios" ? 20 : 0,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
