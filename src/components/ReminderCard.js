import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format, isPast, isToday } from "date-fns";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";

export const ReminderCard = ({ reminder, onDone, onSnooze }) => {
  const { theme, isDark } = useTheme();
  const timeDate = new Date(reminder.time);

  let priorityColor = COLORS.reminder;
  if (reminder.priority === "Important") priorityColor = "#FF3B30";
  if (reminder.priority === "Low") priorityColor = "#34C759";

  const isOverdue = isPast(timeDate) && !isToday(timeDate);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: isOverdue ? `${COLORS.reminder}50` : theme.border,
          borderWidth: 1,
          shadowColor: isDark ? priorityColor : "#000",
          shadowOpacity: isDark ? 0.08 : 0.05,
        },
      ]}
    >
      {reminder.priority === "Important" && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: `${priorityColor}08` },
          ]}
        />
      )}

      <View style={[styles.accentStrip, { backgroundColor: priorityColor }]} />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.time,
              { color: isOverdue ? COLORS.reminder : theme.text },
            ]}
          >
            {format(timeDate, "h:mm a")}
            {isOverdue && <Text style={{ fontSize: 12 }}> (Overdue)</Text>}
          </Text>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {reminder.title}
          </Text>
          {reminder.notes ? (
            <Text
              style={[styles.notes, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {reminder.notes}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            {reminder.repeat && reminder.repeat !== "None" && (
              <View style={styles.badge}>
                <MaterialCommunityIcons
                  name="repeat"
                  size={12}
                  color={theme.textSecondary}
                />
                <Text
                  style={[styles.badgeText, { color: theme.textSecondary }]}
                >
                  {reminder.repeat}
                </Text>
              </View>
            )}
            {reminder.priority && reminder.priority !== "Normal" && (
              <View style={styles.badge}>
                <MaterialCommunityIcons
                  name="flag"
                  size={12}
                  color={priorityColor}
                />
                <Text style={[styles.badgeText, { color: priorityColor }]}>
                  {reminder.priority}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onSnooze(reminder.id)}
            style={[
              styles.actionBtn,
              { backgroundColor: `${COLORS.reminder}15` },
            ]}
          >
            <MaterialCommunityIcons
              name="sleep"
              size={20}
              color={COLORS.reminder}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDone(reminder.id)}
            style={[
              styles.actionBtn,
              { backgroundColor: `${theme.text}10`, marginLeft: 8 },
            ]}
          >
            <MaterialCommunityIcons name="check" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  accentStrip: {
    width: 4,
    height: "100%",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  time: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  notes: {
    fontSize: 13,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
