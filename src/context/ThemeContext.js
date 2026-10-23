import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { COLORS } from "../constants/colors";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === "dark");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const stored = await AsyncStorage.getItem("@app_theme");
    if (stored) {
      setIsDark(stored === "dark");
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem("@app_theme", newTheme ? "dark" : "light");
  };

  const theme = {
    ...COLORS,
    background: isDark ? "#000000" : "#FFFFFF", // Pure Black vs Pure White
    card: isDark ? "#121212" : "#F2F2F7", // Elevated pure surfaces
    text: isDark ? "#F2F2F7" : "#1C1C1E", // High contrast legibility
    textSecondary: isDark ? "#8E8E93" : "#8E8E93",
    border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    blurTint: isDark ? "dark" : "light",
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
