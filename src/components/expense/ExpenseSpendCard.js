import { differenceInDays, endOfMonth } from "date-fns";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const ExpenseSpendCard = ({ totalSpent, budgetLimit }) => {
  const { theme } = useTheme();
  const left = budgetLimit - totalSpent;
  const progress = Math.min((totalSpent / budgetLimit) * 100, 100);

  const isOverBudget = left < 0;
  const statusColor = isOverBudget
    ? "#FF5252"
    : left < budgetLimit * 0.2
      ? "#FF9800"
      : "#66BB6A";

  const today = new Date();
  const end = endOfMonth(today);
  const remainingDays = differenceInDays(end, today) || 1;
  const safeToSpend = Math.max(0, left / remainingDays);

  return (
    <View style={styles.container}>
      <BlurView
        intensity={theme.blurTint === "dark" ? 40 : 80}
        tint={theme.blurTint}
        style={[styles.blurView, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          THIS MONTH
        </Text>
        <Text style={[styles.amount, { color: theme.text }]}>
          ₹{totalSpent.toLocaleString()}
        </Text>

        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBarBG, { backgroundColor: theme.border }]}
          >
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%`, backgroundColor: statusColor },
              ]}
            />
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text
            style={[
              styles.remainingText,
              { color: isOverBudget ? "#FF5252" : theme.textSecondary },
            ]}
          >
            {isOverBudget
              ? `Over spent by ₹${Math.abs(left).toLocaleString()}`
              : `₹${left.toLocaleString()} left`}
          </Text>
          {!isOverBudget && (
            <Text style={[styles.safeText, { color: theme.primary }]}>
              Safe today: ₹{Math.round(safeToSpend).toLocaleString()}
            </Text>
          )}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  blurView: {
    padding: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  amount: {
    fontSize: 40,
    fontWeight: "200",
    letterSpacing: -1,
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBarBG: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remainingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  safeText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
