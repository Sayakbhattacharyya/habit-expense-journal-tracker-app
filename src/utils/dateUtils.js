import { addDays, format, startOfWeek } from "date-fns";

export const getWeekDays = (startDate = new Date()) => {
  const start = startOfWeek(startDate, { weekStartsOn: 0 }); // Sunday start
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
};

export const formatDateDisplay = (date) => format(date, "MMM d, yyyy");
export const formatDayName = (date) => format(date, "EEE");
export const formatDayNumber = (date) => format(date, "d");
export const formatTime = (date) => format(date, "h:mm a");

export const generateTimeSlots = (startHour = 6, endHour = 23) => {
  const slots = [];
  for (let i = startHour; i <= endHour; i++) {
    slots.push(`${i}:00`);
    if (i !== endHour) slots.push(`${i}:30`);
  }
  return slots;
};

// Helper to convert time string (HH:MM) to scroll position/minutes
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};
