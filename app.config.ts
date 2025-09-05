import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Special Academy',
  slug: 'special-academy-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.contentbrowser.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF'
    },
    package: 'com.contentbrowser.app'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY || 'your-api-key',
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
      projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '123456789',
      appId: process.env.FIREBASE_APP_ID || 'your-app-id'
    },
    youtubeApiKey: process.env.YOUTUBE_API_KEY || 'your-youtube-api-key',
    googleSheetsUrl: process.env.GOOGLE_SHEETS_URL || 'your-sheets-url'
  },
  scheme: 'content-browser'
});

