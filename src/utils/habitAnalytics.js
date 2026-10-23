import {
    differenceInDays,
    eachDayOfInterval,
    format,
    startOfWeek,
    subDays,
} from "date-fns";

export const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) {
    return { current: 0, best: 0, graceDayUsed: false };
  }

  // Sort dates descending
  const sortedDates = [...completedDates].sort(
    (a, b) => new Date(b) - new Date(a),
  );

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let graceDayUsed = false;

  const today = new Date();
  const yesterday = subDays(today, 1);
  const todayStr = format(today, "yyyy-MM-dd");
  const yesterdayStr = format(yesterday, "yyyy-MM-dd");

  // Check if current streak is alive
  let isStreakAlive = false;

  // If latest completion is today or yesterday, streak is alive
  if (sortedDates.includes(todayStr) || sortedDates.includes(yesterdayStr)) {
    isStreakAlive = true;
  } else {
    // Grace day logic for current streak: If latest completion was 2 days ago, we used a grace day yesterday
    const twoDaysAgoStr = format(subDays(today, 2), "yyyy-MM-dd");
    if (sortedDates.includes(twoDaysAgoStr)) {
      isStreakAlive = true;
      graceDayUsed = true;
    }
  }

  if (isStreakAlive) {
    currentStreak = 1;
    let checkDate = sortedDates[0]; // Start from the most recent completion

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i]);
      const currDate = new Date(checkDate);
      const diff = differenceInDays(currDate, prevDate);

      if (diff === 1) {
        currentStreak++;
        checkDate = sortedDates[i];
      } else if (diff === 2) {
        // Grace day logic: allow 1 missed day without breaking streak, but only count the completed days
        currentStreak++;
        checkDate = sortedDates[i];
      } else {
        break; // Streak broken
      }
    }
  }

  // Calculate best streak historically
  tempStreak = 1;
  bestStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i]);
    const currDate = new Date(sortedDates[i - 1]);
    const diff = differenceInDays(currDate, prevDate);

    if (diff === 1 || diff === 2) {
      tempStreak++;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else {
      tempStreak = 1;
    }
  }

  return { current: currentStreak, best: bestStreak, graceDayUsed };
};

export const getWeeklyConsistency = (completedDates) => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  const daysOfThisWeek = eachDayOfInterval({ start, end: today });

  let completedThisWeek = 0;
  daysOfThisWeek.forEach((day) => {
    if (completedDates.includes(format(day, "yyyy-MM-dd"))) {
      completedThisWeek++;
    }
  });

  const completionRate =
    daysOfThisWeek.length > 0 ? completedThisWeek / daysOfThisWeek.length : 0;

  return {
    rate: Math.round(completionRate * 100),
    completedDays: completedThisWeek,
    totalDaysPassed: daysOfThisWeek.length,
  };
};

export const generateHabitMicrotext = (total, completed) => {
  const remaining = total - completed;
  if (total === 0) return "Ready to start building habits?";
  if (remaining === 0) return "Perfect day! All habits completed. 🌟";
  if (remaining === 1) return "Just 1 habit left. You've got this! 🔥";
  if (completed === 0) return `Let's get started. ${remaining} habits await.`;
  return `${remaining} habits left. Progress over perfection. 🌿`;
};

export const generateHeatmapData = (habits, days = 28) => {
  const today = new Date();
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");

    let completedCount = 0;
    habits.forEach((h) => {
      if (h.completedDates?.includes(dateStr)) {
        completedCount++;
      }
    });

    let intensity = 0;
    if (completedCount > 0) intensity = 1;
    if (completedCount >= 2) intensity = 2;
    if (completedCount >= 4) intensity = 3;
    if (completedCount >= 6) intensity = 4;

    data.push({
      date: dateStr,
      intensity: intensity,
    });
  }

  return data;
};
