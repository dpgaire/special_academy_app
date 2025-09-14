import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, FlatList, View } from "react-native";
import {
  Card,
  Title,
  Text,
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
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { showSnackbar } = useSnackbar();

  const loadCategories = async () => {
    setIsLoading(true);
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
          size={54}
          label={item.name
            ?.split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
          style={styles.avatar}
          labelStyle={{ fontWeight: "700", fontSize: 20 }}
        />
        <View style={styles.cardInfo}>
          <Title style={styles.cardTitle}>{item.name}</Title>
          <Text style={styles.subText}>{item.description}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return <SkeletonLoader type="card" backgroundColor="#111" />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Title style={{ marginBottom: 12, color: "#fff" }}>
          Failed to load categories
        </Title>
        <Button
          mode="contained"
          icon="reload"
          onPress={() => loadCategories()}
          style={styles.retryButton}
          labelStyle={{ color: "#000", fontWeight: "600" }}
        >
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item._id}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // premium black background
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "left",
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#bbb",
    marginTop: 6,
    textAlign: "left",
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#111", // deep gray for contrast
    shadowColor: "#fff",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingVertical: 10,
  },
  avatar: {
    backgroundColor: "#fff", // white for premium contrast
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  subText: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  retryButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 8,
  },
});

export default CategoriesScreen;
