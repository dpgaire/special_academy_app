import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Title, useTheme, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { api } from '../services/api';
import { Category } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';
import { useSnackbar } from '../contexts/SnackbarContext';


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
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      setError(err.message || 'Failed to load categories');
      showSnackbar('Failed to load categories ddd');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('Subcategories', { categoryId: category._id, categoryName: category.name });
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <Card 
      style={styles.card} 
      onPress={() => handleCategoryPress(item)}
    >
      <Card.Content>
        <Title>{item.name}</Title>
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
        <Title>Failed to load categories</Title>
        <Button mode="contained" onPress={() => loadCategories()}>
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
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadCategories(true)}
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

export default CategoriesScreen;

