import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "react-native-paper";

const SkeletonLoader = ({
  type = "list",
  backgroundColor,
  foregroundColor,
}: {
  type?: "list" | "card";
  backgroundColor?: string;
  foregroundColor?: string;
}) => {
  const { colors } = useTheme();

  const renderItem = (index:number) => (
    <View key={index} style={[styles.card, { backgroundColor: backgroundColor || colors.surface }]}>
      <View style={styles.cardContent}>
        <View style={[styles.avatar, { backgroundColor: foregroundColor || colors.surfaceVariant }]} />
        <View style={styles.textContainer}>
          <Animated.View style={[styles.title, { backgroundColor: foregroundColor || colors.surfaceVariant }]} />
          <Animated.View style={[styles.subtitle, { backgroundColor: foregroundColor || colors.surfaceVariant }]} />
          <Animated.View style={[styles.description, { backgroundColor: foregroundColor || colors.surfaceVariant }]} />
        </View>
      </View>
    </View>
  );

  if (type === "card") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Animated.View style={[styles.title, { width: "40%", backgroundColor: foregroundColor || colors.surfaceVariant }]} />
          <Animated.View style={[styles.subtitle, { width: "60%", backgroundColor: foregroundColor || colors.surfaceVariant }]} />
        </View>
        {[...Array(5)].map((_, index) => renderItem(index))}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {[...Array(5)].map((_, index) => renderItem(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
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
  },
  textContainer: {
    flex: 1,
  },
  title: {
    width: "60%",
    height: 20,
    borderRadius: 4,
    marginBottom: 6,
  },
  subtitle: {
    width: "40%",
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
  },
  description: {
    width: "80%",
    height: 12,
    borderRadius: 4,
  },
});

export default SkeletonLoader;
