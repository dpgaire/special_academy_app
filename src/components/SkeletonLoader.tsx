import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.skeletonBox} />
          <ActivityIndicator style={{ marginTop: 8 }} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  skeletonBox: {
    width: "70%",
    height: 30,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});

export default SkeletonLoader;
