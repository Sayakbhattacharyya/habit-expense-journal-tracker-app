import { FlatList, StyleSheet, View } from "react-native";
import MenuCard from "../components/MenuCard";
import { COLORS } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";

const MENU_ITEMS = [
  {
    id: "1",
    title: "To-Do List",
    screen: "Todo",
    icon: "checkbox-marked-outline",
    color: COLORS.todo,
  },
  {
    id: "2",
    title: "Reminders",
    screen: "Reminder",
    icon: "alarm",
    color: COLORS.reminder,
  },
  {
    id: "3",
    title: "Gym Tracker",
    screen: "Gym",
    icon: "dumbbell",
    color: COLORS.gym,
  },
  {
    id: "4",
    title: "Habit Tracker",
    screen: "Habit",
    icon: "calendar-check",
    color: COLORS.habit,
  },
  {
    id: "5",
    title: "Journal",
    screen: "Journal",
    icon: "notebook-outline",
    color: COLORS.journal,
  },
];

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const renderItem = ({ item }) => (
    <MenuCard
      title={item.title}
      icon={item.icon}
      color={item.color}
      onPress={() => navigation.navigate(item.screen)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={MENU_ITEMS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});

export default HomeScreen;
