import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

export const ExpenseChart = ({ expenses }) => {
  const { theme } = useTheme();

  if (!expenses || expenses.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <Text style={[styles.noDataText, { color: theme.textSecondary }]}>
          No data to display
        </Text>
      </View>
    );
  }

  // Group by category
  const categoryTotals = expenses.reduce((acc, curr) => {
    if (curr.type === "expense") {
      const cat = curr.category.name;
      acc[cat] = (acc[cat] || 0) + curr.amount;
    }
    return acc;
  }, {});

  const totalExpense = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  if (totalExpense === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <Text style={[styles.noDataText, { color: theme.textSecondary }]}>
          No expenses yet
        </Text>
      </View>
    );
  }

  const data = Object.keys(categoryTotals)
    .map((cat) => ({
      name: cat,
      amount: categoryTotals[cat],
      percentage: categoryTotals[cat] / totalExpense,
      color: getCategoryColor(cat),
    }))
    .sort((a, b) => b.amount - a.amount);

  // SVG Chart Logic
  const size = 160;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let angle = 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Spending Breakdown
      </Text>
      <View style={styles.content}>
        <View style={styles.chartContainer}>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${center}, ${center}`}>
              {data.map((item, index) => {
                const strokeDashoffset =
                  circumference - circumference * item.percentage;
                const rotation = angle;
                angle += item.percentage * 360;

                return (
                  <Circle
                    key={index}
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation={rotation}
                    origin={`${center}, ${center}`}
                  />
                );
              })}
            </G>
            {/* Center Text */}
            <View
              style={[
                styles.centerTextContainer,
                { width: size, height: size },
              ]}
            >
              <Text
                style={[styles.centerLabel, { color: theme.textSecondary }]}
              >
                Top
              </Text>
              <Text style={[styles.centerValue, { color: theme.text }]}>
                {data[0]?.name || "-"}
              </Text>
            </View>
          </Svg>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {data.slice(0, 4).map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={[styles.legendText, { color: theme.text }]}>
                {item.name} ({Math.round(item.percentage * 100)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    Food: "#FFAB91",
    Transport: "#90CAF9",
    Bills: "#B39DDB",
    Shopping: "#F48FB1",
    Health: "#80CBC4",
    Entertainment: "#E6EE9C",
    Education: "#FFE082",
    Other: "#BCAAA4",
  };
  return colors[category] || "#B0BEC5";
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 24,
  },
  centerTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabel: {
    fontSize: 10,
    textTransform: "uppercase",
  },
  centerValue: {
    fontSize: 14,
    fontWeight: "bold",
    maxWidth: 80,
    textAlign: "center",
  },
  legend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  noDataText: {
    textAlign: "center",
    fontStyle: "italic",
    padding: 20,
  },
});
