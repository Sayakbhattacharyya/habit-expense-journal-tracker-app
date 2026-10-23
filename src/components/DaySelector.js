import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../constants/colors";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const DaySelector = ({ selectedDay, onSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {DAYS.map((day, index) => {
          const isSelected = selectedDay === day;
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, isSelected && styles.selectedButton]}
              onPress={() => onSelect(day)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedText]}>
                {day}
              </Text>
              {isSelected && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  dayButton: {
    width: 50,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
  },
  selectedButton: {
    backgroundColor: COLORS.reminders,
    // Shadow
    shadowColor: COLORS.reminders,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#fff",
    marginTop: 4,
  },
});
