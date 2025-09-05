import axios from 'axios';
import { createTokenInterceptor } from './tokenInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://special-academy-server.vercel.app/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    const tokens = await AsyncStorage.getItem('authTokens');
    if (tokens) {
      config.headers.Authorization = `Bearer ${JSON.parse(tokens).accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add auth token to requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Set up token refresh interceptor
createTokenInterceptor(api);

