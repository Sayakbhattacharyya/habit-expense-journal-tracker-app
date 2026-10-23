import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export const GlobalFAB = () => {
  const [expanded, setExpanded] = useState(false);
  const animation = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  const toggleMenu = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const navigateTo = (screen, params) => {
    toggleMenu(); // Close menu
    navigation.navigate(screen, params);
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const getButtonStyle = (index) => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -60 * (index + 1)],
    });
    const opacity = animation;
    return {
      transform: [{ translateY }],
      opacity,
    };
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Overlay when expanded */}
      {expanded && (
        <View style={styles.overlay} pointerEvents="auto">
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={toggleMenu}
            />
          </BlurView>
        </View>
      )}
      {/* Action Buttons */}
      <View style={styles.actionsContainer} pointerEvents="box-none">
        <Animated.View style={[styles.actionBtnContainer, getButtonStyle(5)]}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#66BB6A" }]}
            onPress={() => navigateTo("Expense")}
          >
            <MaterialCommunityIcons name="cash" size={20} color="#fff" />
            <Text style={styles.actionLabel}>Expenses</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.actionBtnContainer, getButtonStyle(4)]}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#7E57C2" }]}
            onPress={() => navigateTo("Insights")}
          >
            <MaterialCommunityIcons name="chart-bar" size={20} color="#fff" />
            <Text style={styles.actionLabel}>Insights</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.actionBtnContainer, getButtonStyle(3)]}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#4facfe" }]}
            onPress={() => navigateTo("Todo")}
          >
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              size={20}
              color="#fff"
            />
            <Text style={styles.actionLabel}>Task</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.actionBtnContainer, getButtonStyle(2)]}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#FFB74D" }]}
            onPress={() => navigateTo("Reminder")}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={20}
              color="#fff"
            />
            <Text style={styles.actionLabel}>Reminder</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.actionBtnContainer, getButtonStyle(1)]}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#FF5252" }]}
            onPress={() => navigateTo("Gym")}
          >
            <MaterialCommunityIcons name="dumbbell" size={20} color="#fff" />
            <Text style={styles.actionLabel}>Workout</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.actionBtnContainer, getButtonStyle(0)]}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#66BB6A" }]}
            onPress={() => navigateTo("Habit")}
          >
            <MaterialCommunityIcons
              name="seed-outline"
              size={20}
              color="#fff"
            />
            <Text style={styles.actionLabel}>Habit</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      {/* Main FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={toggleMenu}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <MaterialCommunityIcons name="plus" size={32} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    right: 24,
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    width: width,
    height: height,
    bottom: -30,
    right: -24,
    //backgroundColor: 'rgba(0,0,0,0.3)', // Optional dimming
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6C63FF", // Primary Premium Color
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  actionsContainer: {
    position: "absolute",
    bottom: 20,
    alignItems: "flex-end",
    paddingRight: 8, // Align with center of FAB
  },
  actionBtnContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: 200, // Ensure room for label
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    flexDirection: "row",
  },
  actionLabel: {
    fontWeight: "bold",
    marginLeft: 0,
    position: "absolute",
    right: 60,
    backgroundColor: "#fff",
    color: "#333",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: "hidden",
    fontSize: 12,
    elevation: 2,
  },
});
