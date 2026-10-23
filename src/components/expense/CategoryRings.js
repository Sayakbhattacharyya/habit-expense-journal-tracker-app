import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

// Need to match colors from ExpenseScreen but keeping it simple for rings
const COLORS = [
  "#FFAB91",
  "#90CAF9",
  "#B39DDB",
  "#F48FB1",
  "#80CBC4",
  "#E6EE9C",
];

export const CategoryRings = ({ expenses }) => {
  const { theme } = useTheme();

  const spentByCategory = expenses
    .filter((e) => e.type === "expense")
    .reduce((acc, curr) => {
      const cat = curr.category?.name || "Other";
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {});

  const totalSpent = Object.values(spentByCategory).reduce((a, b) => a + b, 0);

  if (totalSpent === 0) return null;

  const sortedCategories = Object.entries(spentByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // Top 3

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.textSecondary }]}>
        TOP SPENDING
      </Text>
      {sortedCategories.map(([name, amount], index) => {
        const percentage = Math.round((amount / totalSpent) * 100);
        const color = COLORS[index % COLORS.length];

        return (
          <View key={name} style={styles.row}>
            <View style={styles.info}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
            </View>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: `${percentage}%`, backgroundColor: color },
                ]}
              />
            </View>
            <Text style={[styles.amount, { color: theme.textSecondary }]}>
              {percentage}%
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  barContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 3,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 3,
  },
  amount: {
    fontSize: 12,
    fontWeight: "600",
    width: 32,
    textAlign: "right",
  },
});
