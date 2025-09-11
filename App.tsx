import RootNavigator from './src/navigation/RootNavigator';
import { SnackbarProvider } from './src/contexts/SnackbarContext';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  usePreventScreenCapture();
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SnackbarProvider>
          <AuthProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </SnackbarProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
