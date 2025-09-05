import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    // User is not authenticated, navigate to Login screen
    // Using navigate with replace to prevent going back to protected routes
    React.useEffect(() => {
      navigation.replace('Login');
    }, [navigation]);
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

