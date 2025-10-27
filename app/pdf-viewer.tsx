import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Pdf from "react-native-pdf";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PDFSource {
  uri: string;
}

export default function PDFViewerScreen() {
  const { bookName, bookPath, initialPage } = useLocalSearchParams();
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [source, setSource] = useState<PDFSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfRef, setPdfRef] = useState<any>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Preparing your spiritual journey...");
  const [loadingAnimation] = useState(new Animated.Value(0));

  const loadPDF = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the asset from the bundle
      let asset;
      if (bookPath === "Hafezi-Quran.pdf") {
        asset = require("../src/books/pdfs/Hafezi-Quran.pdf");
      } else if (bookPath === "The-noble-Quran.pdf") {
        asset = require("../src/books/pdfs/The-noble-Quran.pdf");
      } else {
        throw new Error("PDF file not found");
      }

      // Load the asset and get its local URI
      const assetObj = Asset.fromModule(asset);
      await assetObj.downloadAsync();

      // Use the asset's local URI directly
      const assetUri = assetObj.localUri || assetObj.uri;
      setSource({ uri: assetUri });
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError("Failed to load PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [bookPath]);

  useEffect(() => {
    loadPDF();
  }, [loadPDF]);

  // Loading animation and message cycling
  useEffect(() => {
    if (loading) {
      // Start pulsing animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(loadingAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(loadingAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Cycle through inspirational messages
      const messages = [
        "Preparing your spiritual journey...",
        "Loading the Holy Quran...",
        "May Allah bless your reading...",
        "Connecting to divine wisdom...",
        "Almost ready to begin...",
      ];

      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        setLoadingMessage(messages[messageIndex]);
        messageIndex = (messageIndex + 1) % messages.length;
      }, 2000);

      return () => {
        pulseAnimation.stop();
        clearInterval(messageInterval);
      };
    }
  }, [loading, loadingAnimation]);

  const saveCurrentPage = useCallback(async (page: number) => {
    try {
      const key = `lastReadPage_${bookPath}`;
      await AsyncStorage.setItem(key, page.toString());
    } catch (error) {
      console.error('Error saving current page:', error);
    }
  }, [bookPath]);

  const handleBack = () => {
    router.back();
  };

  const goToPreviousPage = () => {
    if (isNavigating || currentPage <= 1) return;
    
    setIsNavigating(true);
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    pdfRef?.setPage(newPage);
    saveCurrentPage(newPage);
    
    // Reset navigation state after a short delay
    setTimeout(() => setIsNavigating(false), 300);
  };

  const goToNextPage = () => {
    if (isNavigating || currentPage >= totalPages) return;
    
    setIsNavigating(true);
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    pdfRef?.setPage(newPage);
    saveCurrentPage(newPage);
    
    // Reset navigation state after a short delay
    setTimeout(() => setIsNavigating(false), 300);
  };

  const handlePageChanged = (page: number, numberOfPages: number) => {
    setCurrentPage(page);
    setTotalPages(numberOfPages);
    saveCurrentPage(page);
  };

  const handleLoadComplete = (numberOfPages: number, filePath: string) => {
    setTotalPages(numberOfPages);
    console.log(`Number of pages: ${numberOfPages}`);
    
    // Validate and set initial page after PDF loads
    if (initialPage) {
      const requestedPage = parseInt(initialPage as string, 10);
      if (requestedPage >= 1 && requestedPage <= numberOfPages) {
        setCurrentPage(requestedPage);
        pdfRef?.setPage(requestedPage);
      } else {
        // Show error for invalid page
        setError(`Page ${requestedPage} does not exist. This book has ${numberOfPages} pages.`);
        setCurrentPage(1);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          {/* Animated Book Icon */}
          <Animated.View
            style={[
              styles.bookIconContainer,
              {
                transform: [
                  {
                    scale: loadingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
                opacity: loadingAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ]}
          >
            <Ionicons name="book" size={80} color="#22C55E" />
          </Animated.View>

          {/* Loading Message */}
          <Text style={styles.loadingMessage}>{loadingMessage}</Text>

          {/* Animated Dots */}
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    transform: [
                      {
                        scale: loadingAnimation.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [1, 1.5, 1],
                        }),
                      },
                    ],
                    opacity: loadingAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 1, 0.3],
                    }),
                  },
                ]}
              />
            ))}
          </View>

          {/* Book Name */}
          <Text style={styles.bookName}>{bookName}</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPDF}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{bookName}</Text>
      </View>

      <View style={styles.pdfContainer}>
        {source && (
          <Pdf
            ref={setPdfRef}
            source={source}
            page={currentPage}
            onLoadComplete={handleLoadComplete}
            onPageChanged={handlePageChanged}
            onError={(error) => {
              console.error("PDF Error:", error);
              setError("Failed to display PDF");
            }}
            onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
            enablePaging={false}
            enableRTL={false}
            enableAntialiasing={true}
            enableAnnotationRendering={true}
            password=""
            spacing={0}
            minScale={1.0}
            maxScale={3.0}
            scale={1.0}
            horizontal={false}
            fitPolicy={0}
          />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNavigation, { paddingBottom: bottom + 10 }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            (currentPage <= 1 || isNavigating) && styles.navButtonDisabled,
          ]}
          onPress={goToPreviousPage}
          disabled={currentPage <= 1 || isNavigating}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={(currentPage <= 1 || isNavigating) ? "#ccc" : "#007AFF"}
          />
          <Text
            style={[
              styles.navButtonText,
              (currentPage <= 1 || isNavigating) && styles.navButtonTextDisabled,
            ]}
          >
            {isNavigating ? "Loading..." : "Previous"}
          </Text>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            {currentPage} / {totalPages}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            (currentPage >= totalPages || isNavigating) && styles.navButtonDisabled,
          ]}
          onPress={goToNextPage}
          disabled={currentPage >= totalPages || isNavigating}
        >
          <Text
            style={[
              styles.navButtonText,
              (currentPage >= totalPages || isNavigating) && styles.navButtonTextDisabled,
            ]}
          >
            {isNavigating ? "Loading..." : "Next"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={(currentPage >= totalPages || isNavigating) ? "#ccc" : "#007AFF"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  bookIconContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#F0FDF4",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#BBF7D0",
  },
  loadingMessage: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    marginHorizontal: 4,
  },
  bookName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#22C55E",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    gap: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: "100%",
  },
  bottomNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    gap: 20,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9ecef",
    gap: 8,
    minWidth: 100,
  },
  navButtonDisabled: {
    backgroundColor: "#f8f9fa",
    borderColor: "#e9ecef",
  },
  navButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: "#ccc",
  },
  pageIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
    minWidth: 80,
  },
  pageText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: "#d32f2f",
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
