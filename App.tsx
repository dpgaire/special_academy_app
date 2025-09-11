import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { SnackbarProvider } from './src/contexts/SnackbarContext';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { StatusBar } from 'expo-status-bar';
import { setNavigator } from './src/services/NavigationService';

export default function App() {
  usePreventScreenCapture();
  const navigationRef = React.useRef(null);

  React.useEffect(() => {
    if (navigationRef.current) {
      setNavigator(navigationRef.current);
    }
  }, [navigationRef]);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SnackbarProvider>
          <AuthProvider>
            <NavigationContainer ref={navigationRef}>
              <StatusBar style="auto" />
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </SnackbarProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
