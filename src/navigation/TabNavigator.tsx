import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import HomeNavigator from "./HomeNavigator";
import FavoritesNavigator from "./FavoritesNavigator";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
         tabBarStyle: {
          backgroundColor: colors.background, 
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Favorites" component={FavoritesNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
