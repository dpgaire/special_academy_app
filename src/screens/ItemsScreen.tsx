import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { List, Card, Title, useTheme, ActivityIndicator, Button } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { api } from '../services/api';
import { ContentItem } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';
import { useSnackbar } from '../contexts/SnackbarContext';

type RootStackParamList = {
  Items: { subcategoryId: string; subcategoryName: string };
  ContentWebView: { contentUrl: string; title: string };
};

const ItemsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Items'>>();
  const { subcategoryId, subcategoryName } = route.params;
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
      setError(err.message || 'Failed to load items');
      showSnackbar('Failed to load items');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [subcategoryId]);

  const handleItemPress = (item: ContentItem) => {
    navigation.navigate('ContentWebView', { contentUrl: item?.type ==='pdf' ? item?.file_path : item?.youtube_url, title: item.title });
  };

  const renderItem = ({ item }: { item: ContentItem }) => (
    <Card 
      style={styles.card} 
      onPress={() => handleItemPress(item)}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <List.Subheader>{item.type}</List.Subheader>
        <List.Subheader>{item.description}</List.Subheader>
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
        <Title>Failed to load items</Title>
        <Button mode="contained" onPress={() => loadItems()}>
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
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadItems(true)}
          />
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
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ItemsScreen;

