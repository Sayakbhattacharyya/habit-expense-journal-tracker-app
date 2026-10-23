import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format, isSameDay, isYesterday, parseISO } from "date-fns";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    LayoutAnimation,
    ScrollView,
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AddExpenseModal } from "../components/expense/AddExpenseModal";
import { AddSubscriptionModal } from "../components/expense/AddSubscriptionModal";
import { CategoryRings } from "../components/expense/CategoryRings";
import { ExpenseInsightsModal } from "../components/expense/ExpenseInsightsModal";
import { ExpenseSpendCard } from "../components/expense/ExpenseSpendCard";
import { HealthScoreCard } from "../components/expense/HealthScoreCard";
import { InitialSetupModal } from "../components/expense/InitialSetupModal";
import { SubscriptionCard } from "../components/expense/SubscriptionCard";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { storeData } from "../utils/storage";

const CATEGORY_ICONS = {
  Food: { icon: "food-fork-drink", color: "#FFAB91" },
  Transport: { icon: "car", color: "#90CAF9" },
  Bills: { icon: "home", color: "#B39DDB" },
  Shopping: { icon: "shopping", color: "#F48FB1" },
  Health: { icon: "heart-pulse", color: "#80CBC4" },
  Entertainment: { icon: "gamepad-variant", color: "#E6EE9C" },
  Education: { icon: "school", color: "#FFE082" },
  Work: { icon: "briefcase", color: "#CFD8DC" },
  Other: { icon: "dots-horizontal", color: "#BCAAA4" },
  Salary: { icon: "cash-multiple", color: "#81C784" },
  Freelance: { icon: "laptop", color: "#64B5F6" },
  Investments: { icon: "trending-up", color: "#BA68C8" },
  Gifts: { icon: "gift", color: "#FFD54F" },
  Refunds: { icon: "cash-refund", color: "#4DB6AC" },
  "Other Income": { icon: "plus-circle", color: "#A1887F" },
};

export const ExpenseTimelineCard = ({ item, theme, onDelete }) => {
  const catInfo = CATEGORY_ICONS[item.category?.name] || CATEGORY_ICONS.Other;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, { borderBottomColor: theme.border }]}
      onLongPress={() => onDelete(item.id)}
    >
      <View style={[styles.iconBox, { backgroundColor: `${catInfo.color}15` }]}>
        <MaterialCommunityIcons
          name={catInfo.icon}
          size={24}
          color={catInfo.color}
        />
      </View>
      <View style={styles.cardContent}>
        <Text
          style={[styles.cardTitle, { color: theme.text }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={[styles.cardCategory, { color: theme.textSecondary }]}>
          {item.category?.name || "Other"}
        </Text>
      </View>
      <View style={styles.cardRight}>
        <Text
          style={[
            styles.cardAmount,
            { color: item.type === "income" ? "#66BB6A" : theme.text },
          ]}
        >
          {item.type === "income" ? "+" : "-"}₹{item.amount.toLocaleString()}
        </Text>
        {item.paymentMode === "UPI" && (
          <View style={styles.upiTag}>
            <Text style={styles.upiText}>UPI</Text>
          </View>
        )}
        {item.shared && (
          <View style={styles.sharedTag}>
            <MaterialCommunityIcons
              name="account-group"
              size={12}
              color="#fff"
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ExpenseScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { userData, refreshData } = useData();
  const [modalVisible, setModalVisible] = useState(false);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [setupVisible, setSetupVisible] = useState(false);
  const [insightsVisible, setInsightsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("Timeline"); // Added Tab State

  const expenses = useMemo(() => userData.expenses || [], [userData.expenses]);
  const subscriptions = useMemo(
    () => userData.subscriptions || [],
    [userData.subscriptions],
  );
  const budget = userData.budget || {
    isInitialized: false,
    limit: 2000,
    initialBalance: 0,
  };

  useEffect(() => {
    // If budget has not been explicitly initialized by the new setup flow, show it
    if (!budget.isInitialized) {
      setSetupVisible(true);
    }
  }, [budget.isInitialized]);

  // Generate Chronological Timeline Grouping
  const sections = useMemo(() => {
    // Filter by search and category
    let filtered = expenses;
    if (searchQuery.trim() !== "") {
      const lowerQ = searchQuery.toLowerCase();
      filtered = filtered.filter((e) => e.title.toLowerCase().includes(lowerQ));
    }
    if (filterCategory !== "All") {
      filtered = filtered.filter(
        (e) =>
          e.category?.name === filterCategory ||
          (filterCategory === "Income" && e.type === "income"),
      );
    }

    // Sort all expenses by date (newest first)
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    const grouped = sorted.reduce((acc, curr) => {
      const dateObj = parseISO(curr.date);
      let dateKey = format(dateObj, "yyyy-MM-dd");
      let headerStr = format(dateObj, "MMMM do, yyyy");

      if (isSameDay(dateObj, new Date())) {
        headerStr = "Today";
      } else if (isYesterday(dateObj)) {
        headerStr = "Yesterday";
      }

      if (!acc[dateKey]) {
        acc[dateKey] = { title: headerStr, data: [], total: 0 };
      }
      acc[dateKey].data.push(curr);
      if (curr.type === "expense") {
        acc[dateKey].total += curr.amount;
      } else if (curr.type === "income") {
        // Option 1: Deduct from total. Option 2: Separate. We'll deduct.
        acc[dateKey].total -= curr.amount;
      }
      return acc;
    }, {});

    return Object.values(grouped);
  }, [expenses, searchQuery, filterCategory]);

  const safeTotalSpentThisMonth = expenses
    .filter((e) => e.type === "expense") // Just summing all for now to mock the month
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddExpense = async (newExpense) => {
    const expense = {
      id: Date.now().toString(),
      ...newExpense,
    };
    const updatedExpenses = [expense, ...expenses];
    await storeData("@expenses", updatedExpenses);
    refreshData();
  };

  const handleAddSubscription = async (newSub) => {
    const sub = {
      id: Date.now().toString(),
      ...newSub,
    };
    const updatedSubs = [sub, ...subscriptions];
    await storeData("@subscriptions", updatedSubs);
    refreshData();
  };

  const handleSetupSave = async ({ availableBalance, monthlyIncome }) => {
    const updatedBudget = {
      ...budget,
      isInitialized: true,
      initialBalance: availableBalance,
      limit: monthlyIncome || budget.limit, // If they provided income, use as rough monthly limit for now
    };
    await storeData("@budget", updatedBudget);
    setSetupVisible(false);
    refreshData();
  };

  const deleteExpense = (id) => {
    Alert.alert("Delete Transaction", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const updated = expenses.filter((e) => e.id !== id);
          await storeData("@expenses", updated);
          refreshData();
        },
      },
    ]);
  };

  const deleteSubscription = (id) => {
    Alert.alert("Delete Subscription", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const updated = subscriptions.filter((s) => s.id !== id);
          await storeData("@subscriptions", updated);
          refreshData();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === "Timeline" && { backgroundColor: theme.card },
              ]}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setActiveTab("Timeline");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === "Timeline"
                        ? theme.text
                        : theme.textSecondary,
                  },
                ]}
              >
                Timeline
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === "Subscriptions" && {
                  backgroundColor: theme.card,
                },
              ]}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setActiveTab("Subscriptions");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === "Subscriptions"
                        ? theme.text
                        : theme.textSecondary,
                  },
                ]}
              >
                Subs & EMIs
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.insightsBtn}
            onPress={() => setInsightsVisible(true)}
          >
            <MaterialCommunityIcons
              name="creation"
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "Timeline" ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <ExpenseSpendCard
                totalSpent={safeTotalSpentThisMonth}
                budgetLimit={budget.limit}
              />
              <HealthScoreCard expenses={expenses} budget={budget} />
              <CategoryRings expenses={expenses} />

              {/* Search and Filter Section */}
              <View style={styles.searchContainer}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={24}
                  color={theme.textSecondary}
                />
                <TextInput
                  style={[styles.searchInput, { color: theme.text }]}
                  placeholder="Search transactions..."
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
              >
                {[
                  "All",
                  "Income",
                  "Food",
                  "Transport",
                  "Shopping",
                  "Bills",
                ].map((cat) => {
                  const isSelected = filterCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isSelected
                            ? theme.primary
                            : theme.card,
                        },
                      ]}
                      onPress={() => setFilterCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          { color: isSelected ? "#fff" : theme.textSecondary },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={[styles.timelineTitle, { color: theme.text }]}>
                Timeline
              </Text>
            </>
          }
          renderSectionHeader={({ section: { title, total } }) => (
            <View
              style={[
                styles.sectionHeader,
                { backgroundColor: theme.background },
              ]}
            >
              <Text
                style={[
                  styles.sectionHeaderText,
                  { color: theme.textSecondary },
                ]}
              >
                {title}
              </Text>
              <Text
                style={[
                  styles.sectionHeaderTotal,
                  { color: theme.textSecondary },
                ]}
              >
                ₹{total.toLocaleString()}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <ExpenseTimelineCard
              item={item}
              theme={theme}
              onDelete={deleteExpense}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No transactions yet. Calm your mind.
              </Text>
            </View>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {subscriptions.length === 0 ? (
            <View style={[styles.emptyContainer, { marginTop: 60 }]}>
              <MaterialCommunityIcons
                name="calendar-sync"
                size={64}
                color={theme.border}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No active subscriptions or EMIs.
              </Text>
            </View>
          ) : (
            subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                item={sub}
                onDelete={deleteSubscription}
              />
            ))
          )}
        </ScrollView>
      )}

      {activeTab === "Timeline" ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setModalVisible(true);
          }}
        >
          <MaterialCommunityIcons name="plus" size={32} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSubModalVisible(true);
          }}
        >
          <MaterialCommunityIcons name="plus" size={32} color="#fff" />
        </TouchableOpacity>
      )}

      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddExpense}
      />

      <InitialSetupModal
        visible={setupVisible}
        onClose={() => setSetupVisible(false)}
        onSave={handleSetupSave}
      />
      <AddSubscriptionModal
        visible={subModalVisible}
        onClose={() => setSubModalVisible(false)}
        onSave={handleAddSubscription}
      />
      <ExpenseInsightsModal
        visible={insightsVisible}
        onClose={() => setInsightsVisible(false)}
        expenses={expenses}
        budget={budget}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 4,
  },
  tabBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    fontWeight: "200",
    letterSpacing: -1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterScroll: {
    marginBottom: 24,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionHeaderTotal: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 13,
  },
  cardRight: {
    alignItems: "flex-end",
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: "700",
  },
  upiTag: {
    backgroundColor: "#673AB7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  upiText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  sharedTag: {
    backgroundColor: "#FF9800",
    padding: 4,
    borderRadius: 10,
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 32,
    backgroundColor: "#2196F3",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});

export default ExpenseScreen;
