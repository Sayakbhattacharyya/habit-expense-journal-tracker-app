import { format } from "date-fns";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const GreetingHeader = ({ name = "Sayak" }) => {
  const { theme } = useTheme();
  const date = new Date();
  const hour = date.getHours();

  let greeting = "Good Morning";
  if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
  if (hour >= 17) greeting = "Good Evening";

  return (
    <View style={styles.container}>
      <Text style={[styles.date, { color: theme.textSecondary }]}>
        {format(date, "EEEE, MMMM do")}
      </Text>
      <Text style={[styles.greeting, { color: theme.text }]}>
        {greeting},{"\n"}
        <Text style={{ fontWeight: "700", color: theme.primary }}>{name}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    marginTop: 16,
  },
  date: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 34,
    fontWeight: "200", // Very thin
    letterSpacing: -1,
  },
});
