import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const SettingsCard = ({ children }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          shadowColor: theme.isDark ? theme.primary : "#000",
          shadowOpacity: theme.isDark ? 0.05 : 0.1,
        },
      ]}
    >
      <BlurView
        intensity={theme.blurTint === "dark" ? 40 : 80}
        tint={theme.blurTint}
        style={[styles.blurView, { backgroundColor: theme.card }]}
      >
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 24,
    marginHorizontal: 20,
    // Soft shadow for light mode, glow for dark mode
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 8,
  },
  blurView: {
    paddingVertical: 8,
  },
});
