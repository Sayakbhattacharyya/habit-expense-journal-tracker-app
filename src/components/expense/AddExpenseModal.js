import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
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

const EXPENSE_CATEGORIES = [
  { id: "Food", name: "Food", icon: "food-fork-drink", color: "#FFAB91" },
  { id: "Transport", name: "Transport", icon: "car", color: "#90CAF9" },
  { id: "Bills", name: "Bills", icon: "home", color: "#B39DDB" },
  { id: "Shopping", name: "Shopping", icon: "shopping", color: "#F48FB1" },
  { id: "Health", name: "Health", icon: "heart-pulse", color: "#80CBC4" },
  {
    id: "Entertainment",
    name: "Entertainment",
    icon: "gamepad-variant",
    color: "#E6EE9C",
  },
  { id: "Education", name: "Education", icon: "school", color: "#FFE082" },
  { id: "Work", name: "Work", icon: "briefcase", color: "#CFD8DC" },
  { id: "Other", name: "Other", icon: "dots-horizontal", color: "#BCAAA4" },
];

const INCOME_CATEGORIES = [
  { id: "Salary", name: "Salary", icon: "cash-multiple", color: "#81C784" },
  { id: "Freelance", name: "Freelance", icon: "laptop", color: "#64B5F6" },
  {
    id: "Investments",
    name: "Investments",
    icon: "trending-up",
    color: "#BA68C8",
  },
  { id: "Gifts", name: "Gifts", icon: "gift", color: "#FFD54F" },
  { id: "Refunds", name: "Refunds", icon: "cash-refund", color: "#4DB6AC" },
  {
    id: "Other Income",
    name: "Other Income",
    icon: "plus-circle",
    color: "#A1887F",
  },
];

export const AddExpenseModal = ({ visible, onClose, onSave }) => {
  const { theme } = useTheme();

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    EXPENSE_CATEGORIES[0],
  );
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState("expense");
  const [isUPI, setIsUPI] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleSave = () => {
    if (!amount) return; // Amount is the only strict requirement for ultra-fast entry

    onSave({
      amount: parseFloat(amount),
      title: title || selectedCategory.name, // Fallback title
      category: selectedCategory,
      date: date.toISOString(),
      type,
      paymentMode: isUPI ? "UPI" : "Cash/Card",
      shared: isShared,
    });

    setAmount("");
    setTitle("");
    setDate(new Date());
    setType("expense");
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
                { color: amount ? "#2196F3" : theme.textSecondary },
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
          <View
            style={[styles.toggleContainer, { backgroundColor: theme.card }]}
          >
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                type === "expense" && { backgroundColor: `${theme.primary}20` },
              ]}
              onPress={() => {
                setType("expense");
                setSelectedCategory(EXPENSE_CATEGORIES[0]);
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color:
                      type === "expense" ? theme.primary : theme.textSecondary,
                  },
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                type === "income" && { backgroundColor: `#66BB6A20` },
              ]}
              onPress={() => {
                setType("income");
                setSelectedCategory(INCOME_CATEGORIES[0]);
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: type === "income" ? "#66BB6A" : theme.textSecondary,
                  },
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Massive Amount Input - Priority 1 */}
          <View style={styles.amountWrapper}>
            <Text style={[styles.currencySymbol, { color: theme.text }]}>
              ₹
            </Text>
            <TextInput
              style={[styles.amountInput, { color: theme.text }]}
              placeholder="0"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              autoFocus
              maxLength={8}
            />
          </View>

          {/* Quick Note Input - Priority 2 */}
          <TextInput
            style={[
              styles.titleInput,
              { color: theme.text, backgroundColor: theme.card },
            ]}
            placeholder="Add a note... (optional)"
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          {/* Category Grid - Priority 3 (Auto-selected if skipped) */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            CATEGORIES
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {(type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(
              (cat) => {
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryPill,
                      {
                        backgroundColor: isSelected
                          ? `${cat.color}20`
                          : theme.card,
                      },
                      isSelected && { borderColor: cat.color, borderWidth: 1 },
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <MaterialCommunityIcons
                      name={cat.icon}
                      size={20}
                      color={isSelected ? cat.color : theme.textSecondary}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.categoryName,
                        { color: isSelected ? cat.color : theme.textSecondary },
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              },
            )}
          </ScrollView>

          {/* Quick Date Control */}
          <TouchableOpacity
            style={[styles.dateRow, { backgroundColor: theme.card }]}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={20}
              color={theme.textSecondary}
            />
            <Text style={[styles.dateText, { color: theme.text }]}>
              {format(date, "EEEE, MMM do")}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "500",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 6,
    marginBottom: 40,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: "200",
    marginRight: 8,
    opacity: 0.8,
  },
  amountInput: {
    fontSize: 72,
    fontWeight: "200",
    minWidth: 100,
  },
  titleInput: {
    fontSize: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  categoryScroll: {
    marginBottom: 32,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  tagBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});
