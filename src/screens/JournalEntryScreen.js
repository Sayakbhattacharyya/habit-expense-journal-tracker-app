import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";
import { getData, storeData } from "../utils/storage";

const STORAGE_KEY = "@journal";

const MOODS = [
  { id: "great", emoji: "😄", label: "Happy" },
  { id: "good", emoji: "🙂", label: "Good" },
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "neutral", emoji: "😐", label: "Okay" },
  { id: "low", emoji: "😞", label: "Low" },
  { id: "stress", emoji: "😤", label: "Stress" },
];

const PROMPTS = [
  "What went well today?",
  "What challenged you?",
  "What did you learn?",
  "What are you grateful for?",
  "What drained your energy today?",
  "What gave you peace?",
];

const JournalEntryScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSave = async () => {
    if (!content.trim() && !selectedMood) {
      navigation.goBack();
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: content.trim(),
      mood: selectedMood || "neutral",
      tags: selectedTags,
    };

    const existing = (await getData(STORAGE_KEY)) || [];
    const updated = [entry, ...existing];
    await storeData(STORAGE_KEY, updated);

    navigation.goBack();
  };

  const toggleTag = (tag) => {
    Haptics.selectionAsync();
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([tag]); // limit to 1 for simplicity right now, or keep array
    }
  };

  const applyPrompt = (promptText) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setContent((prev) => {
      if (prev.length > 0 && !prev.endsWith("\n\n")) {
        return prev + "\n\n" + promptText + "\n";
      }
      return prev + promptText + "\n";
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <View style={styles.dateHeader}>
          <Text style={[styles.headerDate, { color: theme.textSecondary }]}>
            {format(new Date(), "MMM d, yyyy")}
          </Text>
          <Text style={[styles.headerTime, { color: theme.textSecondary }]}>
            {format(new Date(), "h:mm a")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleSave}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.saveText, { color: COLORS.primary }]}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          How are you feeling?
        </Text>
        <View style={styles.moodContainer}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodBtn,
                { backgroundColor: theme.card, borderColor: theme.border },
                selectedMood === mood.id && {
                  backgroundColor: `${COLORS.primary}20`,
                  borderColor: COLORS.primary,
                },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedMood(mood.id);
                toggleTag(mood.label);
              }}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.input, { color: theme.text }]}
          multiline
          placeholder="What's on your mind? Write freely..."
          placeholderTextColor={theme.textSecondary}
          value={content}
          onChangeText={setContent}
          autoFocus
        />

        <View style={styles.promptsArea}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Guided Prompts
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.promptsScroll}
          >
            {PROMPTS.map((prompt, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.promptChip,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
                onPress={() => applyPrompt(prompt)}
              >
                <MaterialCommunityIcons
                  name="lightbulb-on-outline"
                  size={14}
                  color={COLORS.primary}
                />
                <Text style={[styles.promptText, { color: theme.text }]}>
                  {prompt}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={{ width: 20 }} />
          </ScrollView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 16,
  },
  dateHeader: {
    alignItems: "center",
  },
  headerDate: {
    fontSize: 14,
    fontWeight: "700",
  },
  headerTime: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 16,
    marginTop: 8,
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  moodBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  moodEmoji: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    fontSize: 20,
    lineHeight: 30,
    minHeight: 200,
    textAlignVertical: "top",
    fontWeight: "500",
    marginBottom: 20,
  },
  promptsArea: {
    marginTop: "auto",
    paddingTop: 20,
  },
  promptsScroll: {
    flexDirection: "row",
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  promptChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
    gap: 6,
  },
  promptText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default JournalEntryScreen;
