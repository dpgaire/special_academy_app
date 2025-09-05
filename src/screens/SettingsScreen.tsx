import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text, Title, useTheme, Divider } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {user && (
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <Avatar.Text 
              size={64} 
              label={user.fullName ? user.fullName[0] : "U"} 
              style={{ backgroundColor: colors.primary }}
            />
            <View style={styles.info}>
              <Title>{user.fullName}</Title>
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.role}>
                <MaterialIcons name="verified-user" size={16} color={colors.primary} /> {user.role}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      <Divider style={{ marginVertical: 20 }} />

      <Button
        mode="contained-tonal"
        icon="logout"
        onPress={logout}
        style={styles.logoutButton}
        contentStyle={{ paddingVertical: 8 }}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  card: {
    borderRadius: 16,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  info: {
    flex: 1,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  role: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    borderRadius: 12,
  },
});

export default SettingsScreen;
