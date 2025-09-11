import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoriesScreen from "../screens/CategoriesScreen";
import { SafeAreaView } from 'react-native-safe-area-context';

import SubcategoriesScreen from "../screens/SubcategoriesScreen";
import ItemsScreen from "../screens/ItemsScreen";
import ContentWebViewScreen from "../screens/ContentWebViewScreen";
import { useTheme } from "react-native-paper";
import SettingsScreen from "../screens/SettingsScreen";
import HeaderRight from "../components/HeaderRight";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeNavigator = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "left",
      }}
    >
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: "Course Categories",
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="Subcategories"
        component={SubcategoriesScreen}
        options={({ route }) => ({
          title: route.params.categoryName || "Subcategories",
          headerRight: () => <HeaderRight />,
        })}
      />
      <Stack.Screen
        name="Items"
        component={ItemsScreen}
        options={({ route }) => ({
          title: route.params.subcategoryName,
          headerRight: () => <HeaderRight />,
        })}
      />
      <Stack.Screen
        name="ContentWebView"
        component={ContentWebViewScreen}
        options={({ route }) => ({
          title: route.params.name || "Content",
          headerRight: () => <HeaderRight />,
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />
    </Stack.Navigator>
    </SafeAreaView>
  );
};

export default HomeNavigator;
