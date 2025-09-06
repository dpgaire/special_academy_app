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
import SettingsScreen from '../screens/SettingsScreen';
import HeaderRight from '../components/HeaderRight';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
          backgroundColor: colors.background, 
        },
        headerTintColor: colors.primary, 
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'left', 
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
              headerRight: () => <HeaderRight />,
            }}
          />
          <Stack.Screen 
            name="Subcategories" 
            component={SubcategoriesScreen}
            options={({ route }) => ({ 
              title: route.params.categoryName || 'Subcategories',
              headerRight: () => <HeaderRight />,
            })}
          />
          <Stack.Screen 
            name="Items" 
            component={ItemsScreen}
            options={({ route }) => ({ 
              title: route.params.subcategoryName || 'Items',
              headerRight: () => <HeaderRight />,
            })}
          />
          <Stack.Screen 
            name="ContentWebView" 
            component={ContentWebViewScreen}
            options={({ route }) => ({ 
              title: route.params.title || 'Content',
              headerRight: () => <HeaderRight />,
            })}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ 
              title: 'Settings',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;