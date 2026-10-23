import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { calculateStreak } from "../../utils/habitAnalytics";
import { ProgressRing } from "../ProgressRing";

export const HabitCard = ({ habit, onToggle, onLongPress, theme }) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit.completedDates?.includes(todayStr);
  const currentCount = habit.dailyCounts ? habit.dailyCounts[todayStr] || 0 : 0;

  const { current: currentStreak, graceDayUsed } = calculateStreak(
    habit.completedDates,
  );

  // Animations
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(
    new Animated.Value(isCompletedToday ? 1 : 0),
  ).current;

  useEffect(() => {
    Animated.timing(glowOpacity, {
      toValue: isCompletedToday ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [isCompletedToday, glowOpacity]);

  const handlePress = () => {
    Haptics.impactAsync(
      isCompletedToday
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium,
    );

    // Micro button bounce
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(habit.id);
  };

  const getProgress = () => {
    if (habit.type === "count" && habit.target > 0) {
      return (currentCount / habit.target) * 100;
    }
    return isCompletedToday ? 100 : 0;
  };

  const cardBg = theme.card;
  const highlightColor = habit.color || theme.primary;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: theme.border,
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      {/* Subtle Glow Background when Completed */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.glowLayer,
          { backgroundColor: `${highlightColor}10`, opacity: glowOpacity },
        ]}
      />

      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {habit.title}
          </Text>
          <View style={styles.streakContainer}>
            <MaterialCommunityIcons
              name={graceDayUsed ? "shield-star" : "fire"}
              size={14}
              color={graceDayUsed ? theme.textSecondary : highlightColor}
            />
            <Text style={[styles.streakText, { color: theme.textSecondary }]}>
              {currentStreak} Day Streak
            </Text>
            {habit.group && (
              <View
                style={[
                  styles.groupTag,
                  { backgroundColor: `${highlightColor}20` },
                ]}
              >
                <Text style={[styles.groupTagText, { color: highlightColor }]}>
                  {habit.group}
                </Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionSection}
          onPress={handlePress}
          onLongPress={() => onLongPress && onLongPress(habit.id)}
          activeOpacity={0.8}
        >
          <View style={styles.ringContainer}>
            <ProgressRing
              radius={24}
              stroke={4}
              progress={getProgress()}
              color={highlightColor}
              bg={theme.border}
            />
            <View style={[StyleSheet.absoluteFill, styles.checkContainer]}>
              {habit.type === "count" ? (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: isCompletedToday
                      ? highlightColor
                      : theme.textSecondary,
                  }}
                >
                  {currentCount}
                </Text>
              ) : isCompletedToday ? (
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color={highlightColor}
                />
              ) : (
                <MaterialCommunityIcons
                  name="circle-outline"
                  size={20}
                  color={theme.textSecondary}
                  opacity={0.3}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden", // Keep glow inside rounded borders
  },
  glowLayer: {
    borderRadius: 24,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
  },
  groupTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 10,
  },
  groupTagText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  actionSection: {
    padding: 4,
  },
  ringContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
