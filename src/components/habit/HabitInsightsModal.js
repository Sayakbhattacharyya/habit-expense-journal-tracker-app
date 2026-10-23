import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    generateHeatmapData,
    getWeeklyConsistency,
} from "../../utils/habitAnalytics";

export const HabitInsightsModal = ({ visible, onClose, habits, theme }) => {
  if (!habits) return null;

  // Flatten all completion dates
  const allCompletedDates = habits.reduce((acc, habit) => {
    return acc.concat(habit.completedDates || []);
  }, []);

  // Compute Weekly Consistency
  const consistencyData = getWeeklyConsistency(allCompletedDates);

  // Compute Heatmap Data (last 28 days)
  const heatmapData = generateHeatmapData(habits, 28);

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return `${theme.border}80`; // faint empty
    if (intensity === 1) return `${theme.primary}40`;
    if (intensity === 2) return `${theme.primary}80`;
    if (intensity === 3) return theme.primary;
    return theme.primary; // could be darker primary for max
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Insights
              </Text>
              <Text style={{ color: theme.textSecondary }}>
                Progress over perfection 🌿
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Weekly Consistency Card */}
            <View
              style={[
                styles.insightCard,
                { backgroundColor: theme.background },
              ]}
            >
              <View style={styles.insightHeader}>
                <MaterialCommunityIcons
                  name="chart-timeline-variant"
                  size={24}
                  color="#8C9EFF"
                />
                <Text style={[styles.insightTitle, { color: theme.text }]}>
                  Weekly Consistency
                </Text>
              </View>
              <Text style={[styles.insightValue, { color: theme.text }]}>
                {consistencyData.rate}%
              </Text>
              <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
                You completed habits on {consistencyData.completedDays} days
                this week.
              </Text>
            </View>

            {/* Consistency Heatmap */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              Last 28 Days
            </Text>
            <View
              style={[
                styles.insightCard,
                { backgroundColor: theme.background },
              ]}
            >
              <View style={styles.heatmapGrid}>
                {heatmapData.map((day, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.heatmapCube,
                      { backgroundColor: getIntensityColor(day.intensity) },
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Smart Suggestions */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              Smart Suggestions
            </Text>

            <View
              style={[
                styles.suggestionCard,
                { backgroundColor: `${theme.primary}15` },
              ]}
            >
              <MaterialCommunityIcons
                name="lightbulb-on"
                size={20}
                color={theme.primary}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.suggestionTitle, { color: theme.text }]}>
                  Try Habit Stacking
                </Text>
                <Text
                  style={[
                    styles.suggestionText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Pair an existing strong habit with a new one you&apos;re
                  building to increase success rate.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.suggestionCard,
                { backgroundColor: `${theme.primary}15`, marginTop: 12 },
              ]}
            >
              <MaterialCommunityIcons
                name="clock-check"
                size={20}
                color={theme.primary}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.suggestionTitle, { color: theme.text }]}>
                  Optimal Timing
                </Text>
                <Text
                  style={[
                    styles.suggestionText,
                    { color: theme.textSecondary },
                  ]}
                >
                  You complete most of your habits before noon. Keep
                  capitalizing on your morning energy!
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  closeBtn: {
    padding: 4,
    backgroundColor: "#00000008",
    borderRadius: 20,
  },
  insightCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  insightValue: {
    fontSize: 48,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  heatmapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "flex-start",
  },
  heatmapCube: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  suggestionCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
