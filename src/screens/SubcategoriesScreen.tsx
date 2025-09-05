import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import {
  Card,
  Title,
  Text,
  useTheme,
  Button,
  Avatar,
  Divider,
} from "react-native-paper";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { api } from "../services/api";
import { Subcategory } from "../types";
import SkeletonLoader from "../components/SkeletonLoader";
import { useSnackbar } from "../contexts/SnackbarContext";

type RootStackParamList = {
  Subcategories: { categoryId: string; categoryName: string };
  Items: { subcategoryId: string; subcategoryName: string };
};

const SubcategoriesScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Subcategories">>();
  const { categoryId, categoryName } = route.params;
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();

  const loadSubcategories = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    else setIsRefreshing(true);

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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubcategories();
  }, [categoryId]);

  const handleSubcategoryPress = (subcategory: Subcategory) => {
    navigation.navigate("Items", {
      subcategoryId: subcategory._id,
      subcategoryName: subcategory.name,
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
          size={48}
          label={item.name.charAt(0).toUpperCase()}
          style={{ backgroundColor: colors.primary }}
        />
        <View style={styles.cardInfo}>
          <Title>{item.name}</Title>
          <Text style={styles.subText}>Tap to view items</Text>
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
        <Title style={{ marginBottom: 12 }}>Failed to load subcategories</Title>
        <Button
          mode="contained-tonal"
          icon="reload"
          onPress={() => loadSubcategories()}
        >
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={subcategories}
        renderItem={renderSubcategoryItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadSubcategories(true)}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Title style={styles.headerTitle}>{categoryName}</Title>
            <Text style={styles.headerSubtitle}>
              Select a subcategory to continue
            </Text>
            <Divider style={{ marginTop: 12 }} />
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

export default SubcategoriesScreen;
