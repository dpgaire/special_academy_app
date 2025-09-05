import axios from 'axios';
import { createTokenInterceptor } from './tokenInterceptor';

const BASE_URL = 'https://special-academy-server.vercel.app/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set up token refresh interceptor
createTokenInterceptor(api);