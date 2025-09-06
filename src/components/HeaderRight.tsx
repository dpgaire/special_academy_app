import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { RootStackParamList } from '../types';

const HeaderRight = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.container}>
      <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
  },
});

export default HeaderRight;
