import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
} from "react-native";
import {
  Card,
  Title,
  Text,
  useTheme,
  Button,
  Avatar,
  Divider,
  IconButton,
} from "react-native-paper";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";
import { ContentItem } from "../types";
import SkeletonLoader from "../components/SkeletonLoader";
import { useSnackbar } from "../contexts/SnackbarContext";

type RootStackParamList = {
  Items: { subcategoryId: string; subcategoryName: string };
  ContentWebView: { contentUrl: string; name: string };
};

const ItemsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Items">>();
  const { subcategoryId, subcategoryName } = route.params;
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    loadItems();
    loadFavorites();
  }, [subcategoryId]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites !== null) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error("Failed to load favorites.", e);
    }
  };

  const toggleFavorite = async (itemId: string) => {
    let newFavorites = [...favorites];
    if (favorites.includes(itemId)) {
      newFavorites = newFavorites.filter((id) => id !== itemId);
    } else {
      newFavorites.push(itemId);
    }
    setFavorites(newFavorites);
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
    } catch (e) {
      console.error("Failed to save favorite.", e);
    }
  };

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/items?subcategoryId=${subcategoryId}`);
      setItems(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load items");
      showSnackbar("Failed to load items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemPress = (item: ContentItem) => {
    const contentUrl = item.type === "pdf" ? item.file_path : item.youtube_url;
    if (contentUrl) {
      navigation.navigate("ContentWebView", {
        contentUrl,
        name: item.name,
      });
    } else {
      showSnackbar("Content not available");
    }
  };

  const getItemIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "file-pdf-box";
      case "youtube_url":
        return "play-circle";
      default:
        return "file-document";
    }
  };

  const renderItem = ({ item }: { item: ContentItem }) => {
    const isFavorite = favorites.includes(item._id);
    return (
      <Card
        style={styles.card}
        onPress={() => handleItemPress(item)}
        mode="elevated"
      >
        <Card.Content style={styles.cardContent}>
          <Avatar.Icon
            size={50}
            icon={getItemIcon(item.type)}
            style={{ backgroundColor: colors.primary }}
            color={colors.onPrimary}
          />
          <View style={styles.cardInfo}>
            <Title style={styles.itemTitle}>{item.name}</Title>
            {item.description ? (
              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
          </View>
          <IconButton
            icon={isFavorite ? "heart" : "heart-outline"}
            iconColor={isFavorite ? colors.error : colors.outline}
            size={24}
            onPress={() => toggleFavorite(item._id)}
          />
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <SkeletonLoader type="card" backgroundColor={colors.surface} />
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Title style={{ marginBottom: 12 }}>Failed to load items</Title>
        <Button mode="contained-tonal" icon="reload" onPress={loadItems}>
          Try Again
        </Button>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={styles.centerContainer}>
        <Title>No items found</Title>
        <Text style={{ marginTop: 6, opacity: 0.6 }}>
          Please check back later
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Title style={styles.headerTitle}>{subcategoryName}</Title>
            <Text style={styles.headerSubtitle}>
              Choose an item to start learning
            </Text>
            <Divider style={{ marginTop: 12 }} />
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
    backgroundColor: "#000", // black background
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff", // white title
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#bbb", // muted gray
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: "#121212", // dark card
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff", // white title
  },
  subText: {
    fontSize: 13,
    color: "#999", // soft gray
    marginTop: 2,
  },
  desc: {
    fontSize: 12,
    color: "#aaa", // slightly lighter gray
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});


export default ItemsScreen;
