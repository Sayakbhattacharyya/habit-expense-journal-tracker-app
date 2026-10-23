import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const DateScroller = ({ selectedDate, onDateSelect }) => {
  // Generate current week dates
  const start = startOfWeek(new Date(), { weekStartsOn: 0 });
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthText}>
          {format(selectedDate, "MMMM yyyy")}
        </Text>
        <TouchableOpacity
          style={styles.todayButton}
          onPress={() => onDateSelect(new Date())}
        >
          <Text style={styles.todayText}>Today</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weekDates.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onDateSelect(date)}
              style={[styles.dateItem, isSelected && styles.selectedItem]}
            >
              <Text style={[styles.dayName, isSelected && styles.selectedText]}>
                {format(date, "EEE")}
              </Text>
              <Text
                style={[styles.dayNumber, isSelected && styles.selectedText]}
              >
                {format(date, "d")}
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
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  todayButton: {
    backgroundColor: "#ffebee", // Light pinkish for accent
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  todayText: {
    color: "#E57373", // Pink/Salmon color
    fontWeight: "600",
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  dateItem: {
    width: 50,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 25,
    backgroundColor: "transparent",
  },
  selectedItem: {
    backgroundColor: "#FF8A80", // Coral/Salmon
    shadowColor: "#FF8A80",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  dayName: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    fontWeight: "500",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedText: {
    color: "#fff",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#fff",
    marginTop: 4,
  },
});
