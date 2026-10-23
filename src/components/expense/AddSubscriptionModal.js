import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { useTheme } from "../../context/ThemeContext";

export const AddSubscriptionModal = ({ visible, onClose, onSave }) => {
  const { theme } = useTheme();

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [cycle, setCycle] = useState("Monthly");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (!amount || !title) return;

    onSave({
      amount: parseFloat(amount),
      title,
      cycle,
      nextBillingDate: date.toISOString().split("T")[0], // Just save YYYY-MM-DD
      type: "subscription",
    });

    setAmount("");
    setTitle("");
    setDate(new Date());
    setCycle("Monthly");
    onClose();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave}>
            <Text
              style={[
                styles.saveText,
                { color: amount && title ? "#2196F3" : theme.textSecondary },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.currencySymbol, { color: theme.text }]}>₹</Text>
          <TextInput
            style={[styles.amountInput, { color: theme.text }]}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />

          <TextInput
            style={[
              styles.titleInput,
              { color: theme.text, backgroundColor: theme.card },
            ]}
            placeholder="Name (e.g., Netflix, Gym EMI)"
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.toggleContainer}>
            {["Monthly", "Yearly", "Weekly"].map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.toggleBtn,
                  cycle === c && { backgroundColor: theme.primary },
                ]}
                onPress={() => setCycle(c)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: cycle === c ? "#fff" : theme.textSecondary },
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.dateBtn, { backgroundColor: theme.card }]}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color={theme.textSecondary}
            />
            <Text style={[styles.dateText, { color: theme.text }]}>
              Next Billing: {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 20,
  },
  cancelText: { fontSize: 16, fontWeight: "500" },
  saveText: { fontSize: 16, fontWeight: "bold" },
  content: { padding: 24 },
  amountInput: {
    fontSize: 56,
    fontWeight: "200",
    textAlign: "center",
    marginBottom: 32,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    position: "absolute",
    top: 12,
    left: "20%",
  },
  titleInput: { fontSize: 16, padding: 16, borderRadius: 16, marginBottom: 24 },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  toggleText: { fontSize: 14, fontWeight: "600" },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  dateText: { fontSize: 16, marginLeft: 12 },
});
