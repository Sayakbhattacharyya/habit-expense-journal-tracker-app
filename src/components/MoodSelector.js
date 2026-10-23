import * as Haptics from "expo-haptics";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

const MOODS = [
  { label: "Happy", emoji: "😄", value: "great", color: "#FFD700" },
  { label: "Good", emoji: "🙂", value: "good", color: "#81C784" },
  { label: "Calm", emoji: "😌", value: "calm", color: "#64B5F6" },
  { label: "Okay", emoji: "😐", value: "neutral", color: "#90A4AE" },
  { label: "Low", emoji: "😞", value: "low", color: "#E57373" },
  { label: "Stress", emoji: "😤", value: "stress", color: "#FF8A65" },
];

export const MoodSelector = ({ selectedMood, onSelect }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        How are you feeling?
      </Text>
      <View style={styles.row}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.moodBtn,
              { backgroundColor: theme.card, borderColor: theme.border },
              selectedMood === mood.value && {
                backgroundColor: `${mood.color}25`,
                borderColor: mood.color,
              },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(mood.value);
            }}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text
              style={[
                styles.moodLabel,
                { color: theme.textSecondary },
                selectedMood === mood.value && {
                  color: mood.color,
                  fontWeight: "bold",
                },
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodBtn: {
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    width: 54,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 9,
    fontWeight: "600",
  },
});
