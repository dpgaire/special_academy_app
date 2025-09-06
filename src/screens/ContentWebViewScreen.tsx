import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { RouteProp, useRoute } from "@react-navigation/native";
import { buildYouTubeEmbedUrl } from "../utils/youtubeUtils";
import { buildPdfEmbedUrl } from "../utils/pdfUtils";

type RootStackParamList = {
  ContentWebView: {
    contentUrl: string;
    title: string;
  };
};

const ContentWebViewScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ContentWebView">>();
  const { contentUrl, title } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();

  // Determine if it's a YouTube URL
  const isYouTube =
    contentUrl.includes("youtube.com") || contentUrl.includes("youtu.be");

  // Determine if it's a PDF URL
  const isPdf =
    contentUrl.toLowerCase().endsWith(".pdf") || contentUrl.includes("pdf");

  let finalUrl = contentUrl;

  if (isYouTube) {
    finalUrl = buildYouTubeEmbedUrl(contentUrl);
  } else if (isPdf) {
    finalUrl = buildPdfEmbedUrl(contentUrl);
  }

  const getHost = (url: string) => {
    if (!url) return "";
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (
      match &&
      match.length > 2 &&
      typeof match[2] === "string" &&
      match[2].length > 0
    ) {
      return match[2];
    }
    return "";
  };

  const initialHost = getHost(finalUrl);

  return (
    <View style={styles.container}>
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
          // 🔒 Block external navigation
          onShouldStartLoadWithRequest={(request) => {
            console.log("Request URL:", request.url);

            // Helper to get host from URL
            const getHost = (url: string) => {
              try {
                return new URL(url).hostname;
              } catch (e) {
                return "";
              }
            };

            const requestHost = getHost(request.url);
            const allowedHosts = ["drive.google.com", "docs.google.com"]; // your allowed domains

            // Only allow URLs with allowed hosts
            if (allowedHosts.some((host) => requestHost.includes(host))) {
              return true;
            }

            // Block everything else (YouTube, external links, etc.)
            return false;
          }}
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
    position: "relative",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    left: 1,
    right: 1,
    top: 1,
    bottom: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});

export default ContentWebViewScreen;
