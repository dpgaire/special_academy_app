import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { List, Card, Title, useTheme, ActivityIndicator, Button } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { api } from '../services/api';
import { Subcategory } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';
import { useSnackbar } from '../contexts/SnackbarContext';

type RootStackParamList = {
  Subcategories: { categoryId: string; categoryName: string };
  Items: { subcategoryId: string; subcategoryName: string };
};

const SubcategoriesScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Subcategories'>>();
  const { categoryId, categoryName } = route.params;
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();

  const loadSubcategories = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    else setIsRefreshing(true);
    
    setError(null);
    
    try {
      const response = await api.get(`/subcategories?categoryId=${categoryId}`);
      setSubcategories(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load subcategories');
      showSnackbar('Failed to load subcategories');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubcategories();
  }, [categoryId]);

  const handleSubcategoryPress = (subcategory: Subcategory) => {
    navigation.navigate('Items', { subcategoryId: subcategory._id, subcategoryName: subcategory.name });
  };

  const renderSubcategoryItem = ({ item }: { item: Subcategory }) => (
    <Card 
      style={styles.card} 
      onPress={() => handleSubcategoryPress(item)}
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
        <Title>Failed to load subcategories</Title>
        <Button mode="contained" onPress={() => loadSubcategories()}>
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
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadSubcategories(true)}
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

export default SubcategoriesScreen;

