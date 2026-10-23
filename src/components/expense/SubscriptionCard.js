import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const SubscriptionCard = ({ item, onDelete }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.cardContainer, { borderBottomColor: theme.border }]}
      onLongPress={() => onDelete(item.id)}
    >
      <View style={[styles.iconBox, { backgroundColor: `${theme.primary}15` }]}>
        <MaterialCommunityIcons name="update" size={24} color={theme.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text
          style={[styles.cardTitle, { color: theme.text }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          {item.cycle} • Next: {item.nextBillingDate}
        </Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={[styles.cardAmount, { color: theme.text }]}>
          ₹{item.amount.toLocaleString()}
        </Text>
        <View style={[styles.tag, { backgroundColor: theme.card }]}>
          <Text style={[styles.tagText, { color: theme.textSecondary }]}>
            {item.category || "Service"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
  },
  cardRight: {
    alignItems: "flex-end",
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: "700",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "600",
  },
});
