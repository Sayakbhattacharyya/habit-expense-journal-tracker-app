import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const InitialSetupModal = ({ visible, onClose, onSave }) => {
  const { theme } = useTheme();
  const [balance, setBalance] = useState("");
  const [income, setIncome] = useState("");

  const handleSave = () => {
    if (!balance) return; // Balance is required for safe-to-spend logic
    onSave({
      availableBalance: parseFloat(balance),
      monthlyIncome: income ? parseFloat(income) : null,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View
          style={[
            styles.content,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            Welcome setup
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Let&apos;s establish your baseline to provide intelligent financial
            health scores and safe-to-spend limits.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              AVAILABLE BALANCE (REQUIRED)
            </Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: theme.background },
              ]}
            >
              <Text style={[styles.currency, { color: theme.textSecondary }]}>
                ₹
              </Text>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="20,000"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={balance}
                onChangeText={setBalance}
                autoFocus
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              MONTHLY INCOME (OPTIONAL)
            </Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: theme.background },
              ]}
            >
              <Text style={[styles.currency, { color: theme.textSecondary }]}>
                ₹
              </Text>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="50,000"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={income}
                onChangeText={setIncome}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, { opacity: balance ? 1 : 0.5 }]}
            onPress={handleSave}
            disabled={!balance}
          >
            <Text style={styles.saveBtnText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currency: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#2196F3",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
