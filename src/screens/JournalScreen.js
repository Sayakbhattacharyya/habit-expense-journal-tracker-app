import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format, isSameDay } from "date-fns";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";
import { getData, storeData } from "../utils/storage";

const STORAGE_KEY = "@journal";

const JournalScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const [entries, setEntries] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkBiometricsAndAuthenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Refresh listener for when navigating back from JournalEntryModal
    const unsubscribe = navigation.addListener("focus", () => {
      if (isUnlocked) {
        loadEntries();
      }
    });

    return unsubscribe;
  }, [navigation, isUnlocked]);

  const checkBiometricsAndAuthenticate = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Unlock your journal",
          fallbackLabel: "Use Passcode",
          disableDeviceFallback: false,
        });

        if (result.success) {
          setIsUnlocked(true);
          loadEntries();
        } else {
          setIsCheckingAuth(false);
        }
      } else {
        // No biometric hardware or not enrolled, just unlock for now
        // In a real app, you might want a custom PIN fallback here
        setIsUnlocked(true);
        loadEntries();
      }
    } catch (e) {
      console.warn("Biometric auth failed", e);
      setIsUnlocked(true);
      loadEntries();
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const loadEntries = async () => {
    const stored = await getData(STORAGE_KEY);
    if (stored) {
      // Sort newest first
      const sorted = stored.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEntries(sorted);
    }
  };

  const deleteEntry = (id) => {
    Alert.alert("Delete Entry", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const updated = entries.filter((e) => e.id !== id);
          setEntries(updated);
          await storeData(STORAGE_KEY, updated);
        },
      },
    ]);
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "great":
        return "😄";
      case "good":
        return "🙂";
      case "low":
        return "😞";
      case "bad":
        return "😫";
      case "calm":
        return "😌";
      case "stress":
        return "😤";
      default:
        return "😐";
    }
  };

  // Grouping logic for Timeline
  const groupedEntries = [];
  let currentDate = null;

  entries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    if (!currentDate || !isSameDay(currentDate, entryDate)) {
      groupedEntries.push({
        type: "header",
        date: entryDate,
        id: `header-${entry.id}`,
      });
      currentDate = entryDate;
    }
    groupedEntries.push({ type: "entry", ...entry });
  });

  const renderItem = ({ item }) => {
    if (item.type === "header") {
      return (
        <View style={styles.timelineHeader}>
          <View
            style={[styles.timelineNode, { backgroundColor: theme.border }]}
          />
          <Text
            style={[styles.timelineHeaderText, { color: theme.textSecondary }]}
          >
            {isSameDay(item.date, new Date())
              ? "TODAY"
              : format(item.date, "EEEE, MMM d")}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.timelineRow}>
        <View
          style={[styles.timelineLine, { backgroundColor: theme.border }]}
        />
        <TouchableOpacity
          style={{ flex: 1, paddingLeft: 24, paddingBottom: 24 }}
          onLongPress={() => deleteEntry(item.id)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.entryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                shadowColor: isDark ? "#000" : COLORS.primary,
                shadowOpacity: isDark ? 0.3 : 0.05,
              },
            ]}
          >
            <View style={styles.entryHeader}>
              <Text style={[styles.entryTime, { color: theme.textSecondary }]}>
                {format(new Date(item.date), "h:mm a")}
              </Text>
              <View
                style={[
                  styles.moodBadge,
                  { backgroundColor: theme.background },
                ]}
              >
                <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
                {item.tags && item.tags.length > 0 && (
                  <Text
                    style={[styles.moodTag, { color: theme.textSecondary }]}
                  >
                    {item.tags[0]}
                  </Text>
                )}
              </View>
            </View>
            <Text style={[styles.entryContent, { color: theme.text }]}>
              {item.content}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (isCheckingAuth) {
    return (
      <View
        style={[
          styles.container,
          styles.centerAll,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  if (!isUnlocked) {
    return (
      <View
        style={[
          styles.container,
          styles.centerAll,
          { backgroundColor: theme.background },
        ]}
      >
        <MaterialCommunityIcons
          name="lock-outline"
          size={64}
          color={theme.textSecondary}
        />
        <Text style={[styles.lockedTitle, { color: theme.text }]}>
          Journal Locked
        </Text>
        <Text style={[styles.lockedSub, { color: theme.textSecondary }]}>
          Your thoughts are completely private.
        </Text>
        <TouchableOpacity
          style={[styles.unlockBtn, { backgroundColor: COLORS.primary }]}
          onPress={checkBiometricsAndAuthenticate}
        >
          <Text style={styles.unlockBtnText}>Unlock Journal</Text>
          <MaterialCommunityIcons
            name="face-recognition"
            size={20}
            color="#fff"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerArea}>
        <Text style={[styles.title, { color: theme.text }]}>Journal</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {entries.length} reflections recorded
        </Text>
      </View>

      <FlatList
        data={groupedEntries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="fountain-pen-tip"
              size={64}
              color={theme.border}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              A blank canvas awaits.
            </Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
              Clear your mind or reflect on your day.
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      {/* We will need to write the new JournalEntryModal screen, but for now we'll route to 'EntryModal' if it was a separate screen, or open a modal component. Let's assume we will build a full screen AddEntry that we navigate to. */}
      {/* Since we need to replace JournalModal, let's keep it as a modal we toggle for now or navigate. The prompt instructions said "Quick Capture Journal" -> let's make it a full screen modal we build in the next step. */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: COLORS.primary, shadowColor: COLORS.primary },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate("JournalEntry"); // Will need to define this route or use a modal
        }}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="feather" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerAll: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
  },
  lockedSub: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  unlockBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
  },
  unlockBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerArea: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: "500",
  },
  list: {
    padding: 24,
    paddingBottom: 100,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  timelineNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 18,
  },
  timelineHeaderText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  timelineRow: {
    flexDirection: "row",
  },
  timelineLine: {
    width: 2,
    marginLeft: 5,
    marginRight: 23,
    borderRadius: 1,
  },
  entryCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  entryTime: {
    fontSize: 13,
    fontWeight: "600",
  },
  moodBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodTag: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
    textTransform: "capitalize",
  },
  entryContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
  },
  emptySub: {
    marginTop: 8,
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});

export default JournalScreen;
