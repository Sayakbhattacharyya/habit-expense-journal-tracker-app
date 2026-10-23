import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const ExpenseSummary = ({ totalSpent, budgetLimit }) => {
  const { theme } = useTheme();

  const progress = Math.min(totalSpent / budgetLimit, 1);
  const remaining = budgetLimit - totalSpent;

  // Determine color based on usage
  let progressColor = "#66BB6A"; // Green
  if (progress > 0.7) progressColor = "#FFB74D"; // Orange
  if (progress > 0.9) progressColor = "#FF5252"; // Red

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Total Spent
          </Text>
          <Text style={[styles.value, { color: theme.text }]}>
            ₹{totalSpent.toFixed(2)}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Remaining
          </Text>
          <Text
            style={[
              styles.remaining,
              { color: remaining < 0 ? "#FF5252" : theme.text },
            ]}
          >
            ₹{remaining.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress * 100}%`, backgroundColor: progressColor },
          ]}
        />
      </View>

      <Text style={[styles.budgetLimit, { color: theme.textSecondary }]}>
        Monthly Budget: ₹{budgetLimit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
  },
  remaining: {
    fontSize: 18,
    fontWeight: "600",
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  budgetLimit: {
    fontSize: 12,
    textAlign: "right",
  },
});
