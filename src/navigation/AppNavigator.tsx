import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import SubcategoriesScreen from '../screens/SubcategoriesScreen';
import ItemsScreen from '../screens/ItemsScreen';
import ContentWebViewScreen from '../screens/ContentWebViewScreen';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper'; // Import useTheme

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme(); // Get theme colors

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary, 
        },
        headerTintColor: '#fff', 
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center', 
      }}
    >
      {!user ? (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen 
            name="Categories" 
            component={CategoriesScreen}
            options={{ 
              title: 'Course Categories',
              // You can override global options for specific screens if needed
            }}
          />
          <Stack.Screen 
            name="Subcategories" 
            component={SubcategoriesScreen}
            options={({ route }) => ({ 
              title: route.params.categoryName || 'Subcategories',
            })}
          />
          <Stack.Screen 
            name="Items" 
            component={ItemsScreen}
            options={({ route }) => ({ 
              title: route.params.subcategoryName || 'Items',
            })}
          />
          <Stack.Screen 
            name="ContentWebView" 
            component={ContentWebViewScreen}
            options={({ route }) => ({ 
              title: route.params.title || 'Content',
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;