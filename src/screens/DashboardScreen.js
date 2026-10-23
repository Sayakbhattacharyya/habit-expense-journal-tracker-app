import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GreetingHeader } from "../components/dashboard/GreetingHeader";
import { useTheme } from "../context/ThemeContext";

const MODULES = [
  {
    id: "todo",
    title: "Tasks",
    icon: "checkbox-marked-circle-outline",
    route: "Todo",
    color: "#4facfe",
  },
  {
    id: "habits",
    title: "Habits",
    icon: "fire",
    route: "Habit",
    color: "#FF9800",
  },
  { id: "gym", title: "Gym", icon: "dumbbell", route: "Gym", color: "#2196F3" },
  {
    id: "expenses",
    title: "Expenses",
    icon: "wallet-outline",
    route: "Expense",
    color: "#66BB6A",
  },
  {
    id: "reminders",
    title: "Reminders",
    icon: "bell-outline",
    route: "Reminder",
    color: "#EC407A",
  },
  {
    id: "journal",
    title: "Journal",
    icon: "notebook-outline",
    route: "Journal",
    color: "#AB47BC",
  },
];

const DashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const renderModuleCard = (module) => (
    <TouchableOpacity
      key={module.id}
      style={styles.cardWrapper}
      onPress={() => navigation.navigate(module.route)}
    >
      <BlurView
        intensity={theme.blurTint === "dark" ? 40 : 80}
        tint={theme.blurTint}
        style={[styles.cardBlur, { backgroundColor: theme.card }]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${module.color}15` },
          ]}
        >
          <MaterialCommunityIcons
            name={module.icon}
            size={32}
            color={module.color}
          />
        </View>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {module.title}
        </Text>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <GreetingHeader />
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => navigation.navigate("Profile")}
          >
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={32}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          MODULES
        </Text>

        <View style={styles.grid}>{MODULES.map(renderModuleCard)}</View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60, // Space for header area
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  profileIcon: {
    marginTop: 20,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 20,
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "47%", // slightly less than 50 to leave gap
    marginBottom: 16,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  cardBlur: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default DashboardScreen;
