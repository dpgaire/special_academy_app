import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { setAuthToken, api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

export const createTokenInterceptor = (axiosInstance: AxiosInstance) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const tokens = await AsyncStorage.getItem('authTokens');
      if (tokens) {
        const parsedTokens = JSON.parse(tokens);
        config.headers.Authorization = `Bearer ${parsedTokens.accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      console.log("Response interceptor error:", JSON.stringify(error));
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const tokens = await AsyncStorage.getItem('authTokens');
          if (!tokens) {
            throw new Error('No tokens found');
          }

          const parsedTokens = JSON.parse(tokens);
          const response = await api.post('/auth/refresh', {
            refreshToken: parsedTokens.refreshToken
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          const newTokens = {
            accessToken,
            refreshToken: newRefreshToken || parsedTokens.refreshToken
          };

          await AsyncStorage.setItem('authTokens', JSON.stringify(newTokens));
          setAuthToken(accessToken);

          processQueue(null, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Log user out
          // The useAuth hook cannot be called here directly as it's a React hook.
          // A better approach would be to dispatch an event or use a global state manager.
          // For now, we'll just remove tokens and let the app handle the unauthenticated state.
          await AsyncStorage.removeItem('authTokens');
          await AsyncStorage.removeItem('user');
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

