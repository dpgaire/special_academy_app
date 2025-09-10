import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
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
    <SafeAreaView style={styles.container}>
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
          // 🔒 Block external navigation with YouTube support
          onShouldStartLoadWithRequest={(request) => {
            // Helper to get host from URL
            const getHost = (url: string) => {
              try {
                return new URL(url).hostname;
              } catch (e) {
                return "";
              }
            };

            const requestHost = getHost(request.url);
            
            // Define allowed hosts based on content type
            let allowedHosts:Array<string> = [];
            
            if (isYouTube) {
              // Allow YouTube embed domains but block main YouTube site and app links
              allowedHosts = [
                "www.youtube-nocookie.com",
                "youtube-nocookie.com",
                "www.youtube.com/embed",
                "youtube.com/embed"
              ];
              
              // Block YouTube app links and main YouTube site
              if (request.url.includes("youtube.com") && !request.url.includes("/embed/")) {
                return false;
              }
              
              // Block YouTube app protocol
              if (request.url.startsWith("youtube://") || request.url.startsWith("vnd.youtube://")) {
                return false;
              }
              
              // Allow embed URLs and related YouTube embed resources
              if (request.url.includes("/embed/") || 
                  requestHost.includes("youtube-nocookie.com") ||
                  request.url.includes("googlevideo.com") ||
                  request.url.includes("ytimg.com") ||
                  request.url.includes("googleusercontent.com")) {
                return true;
              }
              
            } else if (isPdf) {
              // PDF allowed domains
              allowedHosts = ["drive.google.com", "docs.google.com"];
            }

            // Check if the request host is in allowed hosts
            if (allowedHosts.some((host) => 
              requestHost.includes(host) || request.url.includes(host)
            )) {
              return true;
            }

            // Block everything else (external links, redirects, etc.)
            return false;
          }}
          // Additional YouTube-specific configuration
          injectedJavaScript={isYouTube ? `
            // Prevent YouTube from opening external links
            document.addEventListener('click', function(e) {
              const target = e.target.closest('a');
              if (target && target.href && !target.href.includes('/embed/')) {
                e.preventDefault();
                e.stopPropagation();
              }
            }, true);
            
            // Hide YouTube logo and related elements that might redirect
            const style = document.createElement('style');
            style.textContent = \`
              .ytp-youtube-button,
              .ytp-watermark,
              .ytp-title-link,
              .ytp-watch-later-button,
              .ytp-share-button {
                display: none !important;
              }
            \`;
            document.head.appendChild(style);
          ` : undefined}
        />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </SafeAreaView>
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
    // backgroundColor: "rgba(255, 255, 1, 0.8)",
  },
});

export default ContentWebViewScreen;