import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import {
  Card,
  Title,
  Text,
  useTheme,
  Button,
  Avatar,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { api } from "../services/api";
import { Category } from "../types";
import SkeletonLoader from "../components/SkeletonLoader";
import { useSnackbar } from "../contexts/SnackbarContext";

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();

  const loadCategories = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      setError(err.message || "Failed to load categories");
      showSnackbar("Failed to load categories");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryPress = (category: Category) => {
    navigation.navigate("Subcategories", {
      categoryId: category._id,
      categoryName: category.name,
    });
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <Card
      style={styles.card}
      onPress={() => handleCategoryPress(item)}
      mode="elevated"
    >
      <Card.Content style={styles.cardContent}>
        <Avatar.Text
          size={48}
          label={item.name
            ?.split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
          style={{ backgroundColor: colors.primary }}
        />
        <View style={styles.cardInfo}>
          <Title>{item.name}</Title>
          <Text style={styles.subText}>Tap to explore</Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <SkeletonLoader />
      </View>
    );
  }

  if (error && !isRefreshing) {
    return (
      <View style={styles.centerContainer}>
        <Title style={{ marginBottom: 12 }}>Failed to load categories</Title>
        <Button
          mode="contained-tonal"
          icon="reload"
          onPress={() => loadCategories()}
        >
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadCategories(true)}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Title style={styles.headerTitle}>Browse Categories</Title>
            <Text style={styles.headerSubtitle}>
              Pick a category to continue learning
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cardInfo: {
    flex: 1,
  },
  subText: {
    fontSize: 13,
    opacity: 0.6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default CategoriesScreen;
