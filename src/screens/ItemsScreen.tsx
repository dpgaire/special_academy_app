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
import { ContentItem } from "../types";
import SkeletonLoader from "../components/SkeletonLoader";
import { useSnackbar } from "../contexts/SnackbarContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type RootStackParamList = {
  Items: { subcategoryId: string; subcategoryName: string };
  ContentWebView: { contentUrl: string; title: string };
};

const ItemsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Items">>();
  const { subcategoryId, subcategoryName } = route.params;
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();

  const loadItems = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    else setIsRefreshing(true);

    setError(null);

    try {
      const response = await api.get(`/items?subcategoryId=${subcategoryId}`);
      setItems(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load items");
      showSnackbar("Failed to load items");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [subcategoryId]);

  const handleItemPress = (item: ContentItem) => {
    navigation.navigate("ContentWebView", {
      contentUrl: item?.type === "pdf" ? item?.file_path : item?.youtube_url,
      title: item.title,
    });
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
          <Title>{item.title}</Title>
          <Text style={styles.subText}>{item.type.toUpperCase()}</Text>
          {item.description ? (
            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
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
        <Title style={{ marginBottom: 12 }}>Failed to load items</Title>
        <Button
          mode="contained-tonal"
          icon="reload"
          onPress={() => loadItems()}
        >
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadItems(true)}
          />
        }
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
  },
});

export default ItemsScreen;
