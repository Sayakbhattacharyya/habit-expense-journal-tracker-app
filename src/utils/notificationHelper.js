import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

export const setupNotifications = async () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Permission required",
      "Please enable notifications to use reminders.",
    );
    return false;
  }
  return true;
};

export const scheduleReminder = async (title, body, date) => {
  const trigger = date; // Date object triggers at that specific time

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: true,
      },
      trigger,
    });
    return id;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
};

export const cancelReminder = async (notificationId) => {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};
