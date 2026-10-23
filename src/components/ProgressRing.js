import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { COLORS } from "../constants/colors";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressRing = ({
  radius = 40,
  stroke = 8,
  progress = 0,
  color = COLORS.habits,
  bg = "#f0f0f0", // Default background color
}) => {
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        transform: [{ rotate: "-90deg" }],
      }}
    >
      <Svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      >
        <Circle
          stroke={bg}
          strokeWidth={stroke}
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
        />
        <AnimatedCircle
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
        />
      </Svg>
    </View>
  );
};
