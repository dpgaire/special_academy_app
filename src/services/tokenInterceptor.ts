import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
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
  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
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

          const refreshApi = axios.create({
            baseURL: axiosInstance.defaults.baseURL,
          });

          const response = await refreshApi.post('/auth/refresh-token', {
            refreshToken: parsedTokens.refreshToken
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          const newTokens = {
            accessToken,
            refreshToken: newRefreshToken || parsedTokens.refreshToken
          };

          await AsyncStorage.setItem('authTokens', JSON.stringify(newTokens));

          processQueue(null, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
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