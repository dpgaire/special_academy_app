import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "react-native-paper";

const SkeletonLoader = () => {
   const { colors } = useTheme();
  return (
    <View style={{...styles.container}}>
      {[...Array(5)].map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardContent}>
            {/* Avatar placeholder */}
            <View style={styles.avatar} />
            {/* Text placeholders */}
            <View style={styles.textContainer}>
              <Animated.View style={styles.title} />
              <Animated.View style={styles.subtitle} />
              <Animated.View style={styles.description} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#f2f2f2",
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e0e0",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    width: "60%",
    height: 20,
    borderRadius: 4,
    marginBottom: 6,
    backgroundColor: "#e0e0e0",
  },
  subtitle: {
    width: "40%",
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
    backgroundColor: "#e0e0e0",
  },
  description: {
    width: "80%",
    height: 12,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
  },
});

export default SkeletonLoader;
