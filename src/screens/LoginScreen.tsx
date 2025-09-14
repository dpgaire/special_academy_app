import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.content}>
            
            <Title style={styles.title}>Special Academy</Title>
            <Text style={styles.subtitle}>Welcome back 👋</Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              disabled={isLoading}
              theme={{ colors: { text: "#fff", placeholder: "#aaa" } }}
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
                  color="#fff"
                />
              }
              style={styles.input}
              disabled={isLoading}
              theme={{ colors: { text: "#fff", placeholder: "#aaa" } }}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Login
            </Button>

            <Text style={styles.footerText}>
              Don’t have an account? Contact your administrator.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000", // black background for premium look
  },
  container: {
    flexGrow: 3/4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding:24,
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 28,
    fontWeight: '700',
    color: "#fff",
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 16,
    color: "#ccc",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "#111", // subtle contrast against black
  },
  button: {
    marginTop: 12,
    marginBottom: 24,
    borderRadius: 10,
    backgroundColor: "#fff", // white button
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonLabel: {
    color: "#000", // black text on white button
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    color: "#888",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default LoginScreen;
