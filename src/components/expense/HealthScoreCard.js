import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const HealthScoreCard = ({ expenses, budget }) => {
  const { theme } = useTheme();

  // Basic Health Score Calculation
  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((acc, c) => acc + c.amount, budget.limit); // Fallback to budget limit if no income logged

  const totalSpent = expenses
    .filter((e) => e.type === "expense")
    .reduce((acc, c) => acc + c.amount, 0);

  // 1. Budget Adherence (50 pts max)
  const budgetRatio = totalSpent / budget.limit;
  let budgetScore = 50 - budgetRatio * 50;
  if (budgetScore < 0) budgetScore = 0;

  // 2. Savings Ratio (50 pts max)
  const savingsRatio =
    totalIncome > 0 ? (totalIncome - totalSpent) / totalIncome : 0;
  let savingsScore = savingsRatio >= 0.2 ? 50 : Math.max(0, savingsRatio * 250); // 20% savings = full 50 pts

  const totalScore = Math.min(100, Math.round(budgetScore + savingsScore));

  let message = "Exceptional control";
  let color = "#66BB6A";
  if (totalScore < 40) {
    message = "Needs attention";
    color = "#FF5252";
  } else if (totalScore < 70) {
    message = "On track, but be careful";
    color = "#FF9800";
  } else if (totalScore < 90) {
    message = "Doing great!";
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textSecondary }]}>
          FINANCIAL HEALTH
        </Text>
        <Text style={[styles.score, { color }]}>
          {totalScore}
          <Text style={styles.maxScore}>/100</Text>
        </Text>
      </View>
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  score: {
    fontSize: 28,
    fontWeight: "bold",
  },
  maxScore: {
    fontSize: 14,
    opacity: 0.5,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
  },
});
