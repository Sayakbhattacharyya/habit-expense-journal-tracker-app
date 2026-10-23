import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";

import DashboardScreen from "./src/screens/DashboardScreen";
import ExpenseScreen from "./src/screens/ExpenseScreen";
import GymScreen from "./src/screens/GymScreen";
import HabitScreen from "./src/screens/HabitScreen";
import JournalEntryScreen from "./src/screens/JournalEntryScreen";
import JournalScreen from "./src/screens/JournalScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ReminderScreen from "./src/screens/ReminderScreen";
import TodoScreen from "./src/screens/TodoScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DataProvider } from "./src/context/DataContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

const Stack = createNativeStackNavigator();

// ... existing imports

function AppContent() {
  const { theme, isDark } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: theme.background },
          headerShadowVisible: false, // Premium cleaner look
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Todo"
          component={TodoScreen}
          options={{ title: "Tasks" }}
        />
        <Stack.Screen
          name="Reminder"
          component={ReminderScreen}
          options={{ title: "Reminders" }}
        />
        <Stack.Screen
          name="Gym"
          component={GymScreen}
          options={{ title: "Gym Tracker" }}
        />
        <Stack.Screen
          name="Habit"
          component={HabitScreen}
          options={{ title: "Habit Tracker" }}
        />
        <Stack.Screen
          name="Journal"
          component={JournalScreen}
          options={{ title: "Journal" }}
        />
        <Stack.Screen
          name="JournalEntry"
          component={JournalEntryScreen}
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="Expense"
          component={ExpenseScreen}
          options={{ title: "Expense Manager" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profile Settings" }}
        />
      </Stack.Navigator>

      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationContainer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}

export default registerRootComponent(App);
