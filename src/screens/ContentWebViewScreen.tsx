import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Appbar, ActivityIndicator, useTheme } from 'react-native-paper';
import { RouteProp, useRoute } from '@react-navigation/native';
import { buildYouTubeEmbedUrl } from '../utils/youtubeUtils';
import { buildPdfEmbedUrl } from '../utils/pdfUtils';

type RootStackParamList = {
  ContentWebView: { 
    contentUrl: string; 
    title: string;
  };
};

const ContentWebViewScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ContentWebView'>>();
  const { contentUrl, title } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();
  console.log('routes',route.params)

  // Determine if it's a YouTube URL
  const isYouTube = contentUrl.includes('youtube.com') || contentUrl.includes('youtu.be');
  
  // Determine if it's a PDF URL
  const isPdf = contentUrl.toLowerCase().endsWith('.pdf') || contentUrl.includes('pdf');

  let finalUrl = contentUrl;
  
  if (isYouTube) {
    finalUrl = buildYouTubeEmbedUrl(contentUrl);
  } else if (isPdf) {
    finalUrl = buildPdfEmbedUrl(contentUrl);
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title={title} />
      </Appbar.Header>
      
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: finalUrl }}
          style={styles.webview}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        />
        
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default ContentWebViewScreen;

