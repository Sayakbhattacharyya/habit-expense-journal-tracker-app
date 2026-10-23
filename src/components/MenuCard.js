import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");
const cardSize = (width - 48) / 2; // 2 columns with padding

const MenuCard = ({ title, icon, color, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: color,
          backgroundColor: theme.card,
          shadowColor: theme.isDark ? color : "#000",
          shadowOpacity: theme.isDark ? 0.05 : 0.1,
        },
      ]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={icon}
        size={40}
        color={color}
        style={styles.icon}
      />
      <Text style={[styles.title, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardSize,
    height: cardSize,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
    margin: 8,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default MenuCard;
