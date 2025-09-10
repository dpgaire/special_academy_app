import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
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
    <TouchableOpacity 
      onPress={() => navigation.navigate('Settings')} 
      style={styles.container}
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
  },
});

export default HeaderRight;
