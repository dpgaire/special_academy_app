# Content Browser App

A premium React Native mobile application built with Expo for browsing PDFs and YouTube videos with Firebase authentication.

## Features

- **Firebase Authentication** - Secure email/password authentication
- **Content Management** - Google Sheets as CMS for dynamic content
- **PDF Viewing** - Dual mode PDF rendering (preview/native)
- **YouTube Integration** - Video streaming with YouTube Data API
- **Premium UI/UX** - Modern design with dark/light theme support
- **Offline Support** - Cached content for offline browsing
- **Production Ready** - Error handling, loading states, validation

## Tech Stack

- **Framework**: Expo SDK (React Native + TypeScript)
- **Navigation**: React Navigation v6
- **Authentication**: Firebase Auth
- **Data Fetching**: React Query + Axios
- **Storage**: AsyncStorage
- **UI Library**: React Native Paper
- **PDF Viewing**: react-native-pdf + WebView
- **Video**: react-native-youtube-iframe

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   └── content/         # Content-specific components
├── screens/
│   ├── auth/           # Authentication screens
│   ├── categories/     # Category and subcategory screens
│   ├── items/          # Content item screens
│   └── settings/       # Settings screen
├── services/
│   ├── firebase.ts     # Firebase authentication
│   ├── cms.ts          # Google Sheets CMS
│   ├── youtube.ts      # YouTube Data API
│   └── drive.ts        # Google Drive integration
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── constants/          # App configuration
└── utils/              # Utility functions
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Firebase project
- Google Cloud project (for YouTube API)

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd ContentBrowserApp
   npm install
   ```

2. **Configure Firebase**:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication with Email/Password
   - Get your Firebase config object
   - Update `app.config.ts` with your Firebase credentials

3. **Configure YouTube API**:
   - Enable YouTube Data API v3 in Google Cloud Console
   - Create an API key
   - Update `app.config.ts` with your YouTube API key

4. **Configure Google Sheets CMS**:
   - Create a Google Sheet with three tabs: categories, subcategories, items
   - Set up Apps Script Web App or publish as CSV
   - Update `app.config.ts` with your Google Sheets URL

### Environment Configuration

Create a `.env` file in the root directory:

```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=your_app_id
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_SHEETS_URL=your_sheets_url
```

### Running the App

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Run on specific platforms**:
   ```bash
   npm run android    # Android
   npm run ios        # iOS (requires macOS)
   npm run web        # Web browser
   ```

## Data Model

### Google Sheets Structure

**Categories Tab**:
- `id` - Unique identifier
- `name` - Category name
- `order` - Display order

**Subcategories Tab**:
- `id` - Unique identifier
- `categoryId` - Parent category ID
- `name` - Subcategory name
- `order` - Display order

**Items Tab**:
- `id` - Unique identifier
- `subcategoryId` - Parent subcategory ID
- `title` - Content title
- `type` - Content type (`pdf` | `youtube`)
- `driveFileId` - Google Drive file ID (for PDFs)
- `youtubeVideoId` - YouTube video ID (for videos)
- `description` - Content description
- `order` - Display order
- `requiresAuth` - Authentication requirement (TRUE/FALSE)

## Authentication

- Only pre-created Firebase accounts can log in
- No self-registration or password reset in the app
- Persistent login state with AsyncStorage
- Secure logout functionality

## Content Integration

### PDF Files
- Hosted on Google Drive with public sharing
- Preview mode: Google Docs viewer in WebView
- Native mode: Direct download and render
- Automatic fallback for accessibility issues

### YouTube Videos
- Metadata fetched via YouTube Data API v3
- Embedded player with react-native-youtube-iframe
- Thumbnail and title display in lists
- Offline fallback with cached thumbnails

## Theming

- Automatic dark/light mode detection
- Manual theme selection in settings
- Consistent color scheme across all components
- Smooth transitions between themes

## Offline Support

- CMS data cached with AsyncStorage
- 24-hour cache duration with manual refresh
- Graceful degradation when offline
- Error handling with retry mechanisms

## Building for Production

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

## Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a production-ready application with comprehensive error handling, loading states, and user experience optimizations. All sensitive data should be properly configured through environment variables before deployment.

