import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FavoritesScreen from "../screens/FavoritesScreen";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderRight from "../components/HeaderRight";
import ContentWebViewScreen from "../screens/ContentWebViewScreen";

const Stack = createNativeStackNavigator();

const FavoritesNavigator = () => {
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
          name="FavoritesList"
          component={FavoritesScreen}
          options={{
            title: "Favorites",
            headerRight: () => <HeaderRight />,
          }}
        />
        <Stack.Screen
          name="ContentWebView"
          component={ContentWebViewScreen}
          options={({ route }) => ({
            title: (route.params as any)?.name || "Content",
            headerRight: () => <HeaderRight />,
          })}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default FavoritesNavigator;
