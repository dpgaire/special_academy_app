import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView,Platform,ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, useTheme } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      showSnackbar('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    const result = await login({ email, password });
    setIsLoading(false);

    if (!result.success) {
      showSnackbar(result.error || 'Login failed');
    }
  };

  return (
     <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >


    <ScrollView 
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Title style={styles.title}>Welcome! Special Academy</Title>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          disabled={isLoading}
        />
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon 
              icon={showPassword ? "eye-off" : "eye"} 
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={styles.input}
          disabled={isLoading}
        />
        
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Login
        </Button>
        
        <Text style={styles.footerText}>
          Don't have an account? Contact your administrator.
        </Text>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 6,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  footerText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default LoginScreen;

