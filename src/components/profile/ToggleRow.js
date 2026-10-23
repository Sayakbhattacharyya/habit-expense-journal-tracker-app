import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const ToggleRow = ({
  icon,
  label,
  description,
  value,
  onValueChange,
  showDivider = true,
}) => {
  const { theme, isDark } = useTheme();

  const handleToggle = (val) => {
    // We optionally use the context's haptics or global haptics here, but the screen will handle state logic
    // We can also fire a simple haptic here on interaction
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(val);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={24} color={theme.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {description}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={handleToggle}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={isDark ? "#fff" : "#f4f3f4"}
          ios_backgroundColor={theme.border}
        />
      </View>
      {showDivider && (
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginRight: 16,
    opacity: 0.9,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  divider: {
    height: 1,
    marginLeft: 60, // Align with text
    marginRight: 20,
    opacity: 0.5,
  },
});
