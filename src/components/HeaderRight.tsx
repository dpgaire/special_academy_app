import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Avatar, useTheme } from 'react-native-paper';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';

const HeaderRight = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Favorites')} 
        style={styles.iconButton}
      >
        <Ionicons 
          name="heart-outline" 
          size={28} 
          color={colors.primary} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Settings')} 
        style={styles.iconButton}
      >
        {user?.image ? (
          <Avatar.Image 
            size={32} 
            source={{ uri: user.image }} 
          />
        ) : (
          <Ionicons 
            name="person-circle-outline" 
            size={32} 
            color={colors.primary} 
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  iconButton: {
    marginLeft: 15,
  },
});

export default HeaderRight;
