import { format } from "date-fns";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const ExpenseCard = ({ item }) => {
  const { theme } = useTheme();

  const isExpense = item.type === "expense";
  const amountColor = isExpense ? "#FF5252" : "#66BB6A";

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.left}>
        <View
          style={[styles.iconContainer, { backgroundColor: theme.background }]}
        >
          <Text style={styles.icon}>{item.category.icon}</Text>
        </View>
        <View style={styles.details}>
          <Text style={[styles.title, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {format(new Date(item.date), "MMM d, h:mm a")}
          </Text>
        </View>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {isExpense ? "-" : "+"}₹{item.amount.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  details: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
