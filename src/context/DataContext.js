import { format, isSameDay, parseISO } from "date-fns";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { getData } from "../utils/storage";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    todos: [],
    reminders: [],
    habits: [],
    workouts: [],
    journal: [],
    expenses: [],
    subscriptions: [],
    budget: { limit: 2000, alertThreshold: 0.8 },
  });
  const [todayScore, setTodayScore] = useState(0);
  const [timeline, setTimeline] = useState([]);


  const calculateDailyStats = useCallback(
    (todos, habits, workouts, reminders) => {
      const today = new Date();
      const todayStr = format(today, "yyyy-MM-dd");

      // Todos
      const todayTodos = todos.filter((t) => t.date === todayStr);
      const completedTodos = todayTodos.filter((t) => t.completed).length;

      // Habits
      const todayHabitsCount = habits.length; // Active habits
      const completedHabits = habits.filter(
        (h) => h.completedDates && h.completedDates.includes(todayStr),
      ).length;

      // Workouts
      const hasWorkout = workouts.some((w) =>
        isSameDay(parseISO(w.date), today),
      );

      // Scoring Logic (Weighted)
      let totalPoints = 0;
      let earnedPoints = 0;

      // Todos: 40% weight
      if (todayTodos.length > 0) {
        totalPoints += 40;
        earnedPoints += (completedTodos / todayTodos.length) * 40;
      }

      // Habits: 40% weight
      if (todayHabitsCount > 0) {
        totalPoints += 40;
        earnedPoints += (completedHabits / todayHabitsCount) * 40;
      }

      // Workout: 20% weight
      totalPoints += 20;
      if (hasWorkout) earnedPoints += 20;

      const score =
        totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      setTodayScore(score);
    },
    [],
  );

  const generateTimeline = useCallback((todos, reminders, habits, workouts) => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    let items = [];

    // 1. Todos
    todos
      .filter((t) => t.date === todayStr)
      .forEach((t) => {
        items.push({
          id: `todo-${t.id}`,
          type: "todo",
          title: t.title,
          time: t.startTime, // "HH:mm"
          completed: t.completed,
          color: t.color || "#4facfe",
          data: t,
        });
      });

    // 2. Reminders
    reminders.forEach((r) => {
      // Simplified check: if repeats or is today
      // For MVP assuming reminders are daily or specific time today
      // In a real app, strict recurrence parsing is needed
      // Here we check if the reminder time (Date ISO) matches today's time range or is generic
      const rTime = new Date(r.time);
      items.push({
        id: `reminder-${r.id}`,
        type: "reminder",
        title: r.title,
        time: format(rTime, "HH:mm"),
        completed: !r.enabled, // Inverse logic strictly for visual "done" check? No, reminders are just alerts.
        color: "#FFB74D",
        data: r,
      });
    });

    // 3. Workouts (Actual logged ones)
    workouts
      .filter((w) => isSameDay(parseISO(w.date), today))
      .forEach((w) => {
        items.push({
          id: `workout-${w.id}`,
          type: "workout",
          title: "Workout Session",
          time: format(parseISO(w.date), "HH:mm"),
          completed: true,
          color: "#FF5252",
          data: w,
        });
      });

    // Sort by time
    items.sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });

    setTimeline(items);
  }, []);

  const refreshData = useCallback(async () => {
    const [
      todos,
      reminders,
      habits,
      workouts,
      journal,
      expenses,
      subscriptions,
      budget,
    ] = await Promise.all([
      getData("@todos_timeline") || [],
      getData("@reminders_v2") || [],
      getData("@habits_v2") || [],
      getData("@workouts_v2") || [],
      getData("@journal") || [],
      getData("@expenses") || [],
      getData("@subscriptions") || [],
      getData("@budget") || { limit: 2000, alertThreshold: 0.8 }, // Default budget
    ]);

    setUserData({
      todos,
      reminders,
      habits,
      workouts,
      journal,
      expenses,
      subscriptions,
      budget,
    });
    calculateDailyStats(todos, habits, workouts, reminders);
    generateTimeline(todos, reminders, habits, workouts);
  }, [calculateDailyStats, generateTimeline]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <DataContext.Provider
      value={{
        userData,
        todayScore,
        timeline,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
