import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, FlatList, View } from "react-native";
import {
  Card,
  Title,
  Text,
  Button,
  Avatar,
  Divider,
} from "react-native-paper";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { api } from "../services/api";
import { RootStackParamList, Subcategory } from "../types";
import SkeletonLoader from "../components/SkeletonLoader";
import { useSnackbar } from "../contexts/SnackbarContext";

const SubcategoriesScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Subcategories">>();
  const { categoryId, categoryName } = route.params;
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { showSnackbar } = useSnackbar();

  const loadSubcategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/subcategories?categoryId=${categoryId}`
      );
      setSubcategories(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load subcategories");
      showSnackbar("Failed to load subcategories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubcategories();
  }, [categoryId]);

  const handleSubcategoryPress = (subcategory: Subcategory) => {
    navigation.navigate("Items", {
      subcategoryId: subcategory._id,
      subcategoryName: subcategory.name,
      categoryName: categoryName,
    });
  };

  const renderSubcategoryItem = ({ item }: { item: Subcategory }) => (
    <Card
      style={styles.card}
      onPress={() => handleSubcategoryPress(item)}
      mode="elevated"
    >
      <Card.Content style={styles.cardContent}>
        <Avatar.Text
          size={54}
          label={item.name.charAt(0).toUpperCase()}
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
          Failed to load subcategories
        </Title>
        <Button
          mode="contained"
          icon="reload"
          onPress={() => loadSubcategories()}
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
        data={subcategories}
        renderItem={renderSubcategoryItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Title style={styles.headerTitle}>{categoryName}</Title>
            <Text style={styles.headerSubtitle}>
              Select a subcategory to continue
            </Text>
            <Divider style={styles.divider} />
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
    backgroundColor: "#000", // black premium background
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
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
  divider: {
    marginTop: 14,
    backgroundColor: "#222",
    height: 1,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#111",
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
    backgroundColor: "#fff", // premium white initials
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

export default SubcategoriesScreen;
