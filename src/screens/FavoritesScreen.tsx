import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";
import { ContentItem } from "../types";
import SkeletonLoader from "../components/SkeletonLoader";
import { useSnackbar } from "../contexts/SnackbarContext";

type RootStackParamList = {
  Favorites: undefined;
  ContentWebView: { contentUrl: string; name: string };
};

const FavoritesScreen = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites !== null) {
        const favorites = JSON.parse(storedFavorites);
        if (favorites.length > 0) {
          const itemPromises = favorites.map((itemId: string) =>
            api.get(`/items/${itemId}`)
          );
          const responses = await Promise.all(itemPromises);
          const favoriteItems = responses.map((response) => response.data);
          setItems(favoriteItems);
        } else {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } catch (err: any) {
      showSnackbar("Failed to load favorite items");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  const toggleFavorite = async (itemId: string) => {
    const newItems = items.filter((item) => item._id !== itemId);
    setItems(newItems);

    const storedFavorites = await AsyncStorage.getItem("favorites");
    if (storedFavorites !== null) {
      const favorites = JSON.parse(storedFavorites);
      const newFavorites = favorites.filter((id: string) => id !== itemId);
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
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

  const renderItem = ({ item }: { item: ContentItem }) => (
    <Card
      style={styles.card}
      onPress={() => handleItemPress(item)}
      mode="elevated"
    >
      <Card.Content style={styles.cardContent}>
        <Avatar.Icon
          size={48}
          icon={getItemIcon(item.type)}
          style={{ backgroundColor: colors.primary }}
        />
        <View style={styles.cardInfo}>
          <Title>{item.name}</Title>
          <Text style={styles.subText}>{item.type.toUpperCase()}</Text>
          {item.description ? (
            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>
        <IconButton
          icon="heart"
          iconColor={colors.error}
          size={24}
          onPress={() => toggleFavorite(item._id)}
        />
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <SkeletonLoader
        type="card"
        backgroundColor={colors.surface}
      />
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
            <Title style={styles.headerTitle}>Favorites</Title>
            <Text style={styles.headerSubtitle}>
              Your saved items for quick access
            </Text>
            <Divider style={{ marginTop: 12 }} />
          </View>
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Title>No favorite items yet</Title>
            <Text style={{ textAlign: "center" }}>
              Add items to your favorites to see them here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
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
    justifyContent: "space-between",
    padding: 16,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  subText: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  desc: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    textAlign: "center",
  },
});

export default FavoritesScreen;
