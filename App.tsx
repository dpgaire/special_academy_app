import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { SnackbarProvider } from './src/contexts/SnackbarContext';
import { usePreventScreenCapture } from 'expo-screen-capture';

export default function App() {
  usePreventScreenCapture();
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SnackbarProvider>
          <AuthProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </AuthProvider>
        </SnackbarProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
