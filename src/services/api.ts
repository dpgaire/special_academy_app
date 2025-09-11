import axios, { InternalAxiosRequestConfig } from 'axios';
import { createTokenInterceptor } from './tokenInterceptor';
import { getCache, setCache } from '../utils/cache';

const BASE_URL = 'https://special-academy-server.vercel.app/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for caching
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.method === 'get' && !config.url?.includes('auth')) {
      const cachedData = getCache(config.url || '');
      if (cachedData) {
        return Promise.reject({ cachedData, config });
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up token refresh interceptor
createTokenInterceptor(api);

// Response interceptor for caching
api.interceptors.response.use(
  (response) => {
    if (response.config.method === 'get' && !response.config.url?.includes('auth')) {
      setCache(response.config.url || '', response.data);
    }
    return response;
  },
  (error) => {
    if (error.cachedData) {
      return Promise.resolve({
        data: error.cachedData,
        status: 200,
        statusText: 'OK (from cache)',
        headers: {},
        config: error.config,
      });
    }
    return Promise.reject(error);
  }
);