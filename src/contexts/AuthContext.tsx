import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { AuthContextType, User, LoginCredentials, AuthTokens } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedTokens = await AsyncStorage.getItem('authTokens');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedTokens && storedUser) {
        setTokens(JSON.parse(storedTokens));
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load stored auth data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/login', credentials);      
      const { accessToken, refreshToken, ...userData } = response.data;
      const authTokens = {
        accessToken: accessToken,
        refreshToken: refreshToken
      };
      
      setTokens(authTokens);
      setUser(userData);
      
      await AsyncStorage.setItem('authTokens', JSON.stringify(authTokens));
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', { refreshToken: tokens?.refreshToken });
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      setUser(null);
      setTokens(null);
      await AsyncStorage.removeItem('authTokens');
      await AsyncStorage.removeItem('user');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh', {
        refreshToken: tokens?.refreshToken
      });
      
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      const newTokens = {
        accessToken,
        refreshToken: newRefreshToken || tokens?.refreshToken
      };
      
      setTokens(newTokens);
      await AsyncStorage.setItem('authTokens', JSON.stringify(newTokens));
      
      return { success: true };
    } catch (error) {
      logout();
      return { success: false };
    }
  };

  const value = {
    user,
    tokens,
    isLoading,
    login,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

