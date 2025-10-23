import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
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
  const { bookName, bookPath } = useLocalSearchParams();
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [source, setSource] = useState<PDFSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfRef, setPdfRef] = useState<any>(null);

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

  const handleBack = () => {
    router.back();
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      pdfRef?.setPage(newPage);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      pdfRef?.setPage(newPage);
    }
  };

  const handlePageChanged = (page: number, numberOfPages: number) => {
    setCurrentPage(page);
    setTotalPages(numberOfPages);
  };

  const handleLoadComplete = (numberOfPages: number, filePath: string) => {
    setTotalPages(numberOfPages);
    console.log(`Number of pages: ${numberOfPages}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading PDF...</Text>
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
            currentPage <= 1 && styles.navButtonDisabled,
          ]}
          onPress={goToPreviousPage}
          disabled={currentPage <= 1}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentPage <= 1 ? "#ccc" : "#007AFF"}
          />
          <Text
            style={[
              styles.navButtonText,
              currentPage <= 1 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
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
            currentPage >= totalPages && styles.navButtonDisabled,
          ]}
          onPress={goToNextPage}
          disabled={currentPage >= totalPages}
        >
          <Text
            style={[
              styles.navButtonText,
              currentPage >= totalPages && styles.navButtonTextDisabled,
            ]}
          >
            Next
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentPage >= totalPages ? "#ccc" : "#007AFF"}
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
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: "#666",
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
