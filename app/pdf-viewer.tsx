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
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const [source, setSource] = useState<PDFSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      {source && (
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.error("PDF Error:", error);
            setError("Failed to display PDF");
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      )}
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
    backgroundColor: "#f8f9fa",
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
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100,
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
