import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const ExpenseInsightsModal = ({
  visible,
  onClose,
  expenses,
  budget,
}) => {
  const { theme } = useTheme();

  // Mocked AI Calculations for Premium Feel
  const personalityProfiles = [
    {
      title: "The Weekend Warrior",
      desc: "You save diligently during the week but splurge on weekends. Try setting a dedicated fun-fund!",
    },
    {
      title: "The Foodie",
      desc: "Dining out is your major burn rate. Consider cooking one extra meal at home per week to save up to ₹1,500/month.",
    },
    {
      title: "The Consistent Saver",
      desc: "Your burn rate is perfectly linear. You exhibit excellent financial control and foresight.",
    },
  ];

  // Pick one randomly or based on data. We'll pick based on food expenses vs total
  const foodTotal = expenses
    .filter((e) => e.category?.name === "Food")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalSpent = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  let profile = personalityProfiles[2]; // Default
  if (foodTotal > totalSpent * 0.4) profile = personalityProfiles[1];
  else if (totalSpent > 0 && expenses.length > 5)
    profile = personalityProfiles[0];

  const burnRate =
    totalSpent > 0 ? `₹${Math.round(totalSpent / 30)}/day` : "₹0/day";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>
            Intelligent Insights
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Personality Card */}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="brain"
                size={24}
                color={theme.primary}
              />
              <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>
                SPENDING PERSONALITY
              </Text>
            </View>
            <Text style={[styles.profileTitle, { color: theme.text }]}>
              {profile.title}
            </Text>
            <Text style={[styles.profileDesc, { color: theme.textSecondary }]}>
              {profile.desc}
            </Text>
          </View>

          {/* Burn Rate */}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="fire" size={24} color="#FF5252" />
              <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>
                CURRENT BURN RATE
              </Text>
            </View>
            <Text style={[styles.burnRateText, { color: theme.text }]}>
              {burnRate}
            </Text>
            <Text style={[styles.profileDesc, { color: theme.textSecondary }]}>
              Based on your monthly velocity, you are consuming your budget at
              this average daily rate.
            </Text>
          </View>

          {/* AI Suggestion */}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="robot-outline"
                size={24}
                color="#90CAF9"
              />
              <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>
                AI RECOMMENDATION
              </Text>
            </View>
            <Text
              style={[
                styles.profileDesc,
                {
                  color: theme.textSecondary,
                  fontStyle: "italic",
                  marginTop: 8,
                },
              ]}
            >
              &quot;Swapping 2 cab rides this week for public transit could boost
              your financial health score by 4 points and keep you well above
              your safe-to-spend threshold.&quot;
            </Text>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="file-chart"
                size={24}
                color="#81C784"
              />
              <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>
                MONTHLY REPORT CARD
              </Text>
            </View>
            <Text style={[styles.profileDesc, { color: theme.textSecondary }]}>
              Your behavior is trending positively. A full automated report will
              be generated on the 1st of the next month.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  closeButton: {
    marginRight: 16,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
  },
  title: { fontSize: 24, fontWeight: "600", letterSpacing: -0.5 },
  content: { padding: 24, paddingBottom: 100 },
  card: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 16 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginLeft: 12,
  },
  profileTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  profileDesc: { fontSize: 14, lineHeight: 22 },
  burnRateText: {
    fontSize: 32,
    fontWeight: "200",
    letterSpacing: -1,
    marginBottom: 8,
  },
});
