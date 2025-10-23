import { useRouter } from "expo-router";
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { getNextPrayerTime, getPrayerTimes, getTimeUntilNextPrayer, PrayerTimeData } from "@/utils/prayerTimes";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PDFBook {
  id: string;
  name: string;
  path: string;
  image: any;
}

// PrayerTime interface is now imported from utils/prayerTimes

const ITEMS_PER_PAGE = 6;

const HomeScreen = React.memo(() => {
  const [books, setBooks] = useState<PDFBook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData[]>([]);
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { location, error: locationError, loading: locationLoading } = useCurrentLocation();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Memoize prayer times calculation
  const calculatedPrayerTimes = useMemo(() => {
    if (location) {
      return getPrayerTimes(location.lat, location.lon, currentTime);
    }
    return [];
  }, [location, currentTime]);

  // Update prayer times when calculated
  useEffect(() => {
    setPrayerTimes(calculatedPrayerTimes);
  }, [calculatedPrayerTimes]);

  // Memoize next prayer calculation
  const nextPrayer = useMemo(() => {
    return getNextPrayerTime(prayerTimes, currentTime);
  }, [prayerTimes, currentTime]);

  // Memoize time until next prayer
  const timeUntilNextPrayer = useMemo(() => {
    return getTimeUntilNextPrayer(prayerTimes, currentTime);
  }, [prayerTimes, currentTime]);

  // Memoize format functions using Moment.js
  const formatTime = useCallback((date: Date) => {
    return moment(date).format('HH:mm');
  }, []);

  const formatDate = useCallback((date: Date) => {
    return moment(date).format('dddd, MMMM Do YYYY');
  }, []);

  useEffect(() => {
    loadPDFBooks();
  }, []);

  const loadPDFBooks = async () => {
    try {
      setLoading(true);

      // For development, we'll use the static list since we know the files exist
      const pdfBooks: PDFBook[] = [
        {
          id: "1",
          name: "Hafezi Quran",
          path: "Hafezi-Quran.pdf",
          image: require("../src/books/images/hafezi-quran.png"),
        },
        {
          id: "2",
          name: "The Noble Quran",
          path: "The-noble-Quran.pdf",
          image: require("../src/books/images/the-nobel-quran.png"),
        },
      ];

      setBooks(pdfBooks);
    } catch (error) {
      console.error("Error loading PDF books:", error);
      Alert.alert("Error", "Failed to load PDF books");
    } finally {
      setLoading(false);
    }
  };

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentBooks = books.slice(startIndex, endIndex);
    
    return { totalPages, startIndex, endIndex, currentBooks };
  }, [books, currentPage]);

  const { totalPages, currentBooks } = paginationData;

  const handleBookPress = useCallback((book: PDFBook) => {
    router.push({
      pathname: "/pdf-viewer",
      params: {
        bookName: book.name,
        bookPath: book.path,
      },
    });
  }, [router]);

  const renderPagination = useCallback(() => {
    if (totalPages <= 1) return null;

    return (
      <ThemedView style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.disabledButton,
          ]}
          onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <IconSymbol
            name="chevron.left"
            size={20}
            color={currentPage === 1 ? "#999" : "#22C55E"}
          />
        </TouchableOpacity>

        <ThemedText style={styles.pageInfo}>
          {currentPage} of {totalPages}
        </ThemedText>

        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.disabledButton,
          ]}
          onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <IconSymbol
            name="chevron.right"
            size={20}
            color={currentPage === totalPages ? "#999" : "#22C55E"}
          />
        </TouchableOpacity>
      </ThemedView>
    );
  }, [totalPages, currentPage]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>Loading books...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={[styles.scrollContainer]}
      showsVerticalScrollIndicator={false}
    >
        {/* Next Prayer Highlight */}
      <ThemedView style={[styles.nextPrayerSection, { paddingTop: top }]}>
        <ThemedView style={styles.nextPrayerCard}>
          <View style={styles.nextPrayerInfo}>
            {locationLoading ? (
              <ThemedText style={styles.nextPrayerName}>
                Getting location...
              </ThemedText>
            ) : locationError ? (
              <ThemedText style={styles.nextPrayerName}>
                Location access denied
              </ThemedText>
            ) : nextPrayer ? (
              <>
                <ThemedText style={styles.nextPrayerName}>
                  Next: {nextPrayer.name}
                </ThemedText>
                <ThemedText style={styles.nextPrayerTime}>
                  {nextPrayer.time}
                </ThemedText>
                <ThemedText style={styles.nextPrayerRelativeTime}>
                  {timeUntilNextPrayer}
                </ThemedText>
              </>
            ) : (
              <ThemedText style={styles.nextPrayerName}>
                Loading prayer times...
              </ThemedText>
            )}
          </View>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.container}>
        {/* Header with Current Time and Date */}
        <ThemedView style={styles.headerSection}>
          <ThemedView style={styles.timeCard}>
            <ThemedText style={styles.currentTime}>
              {formatTime(currentTime)}
            </ThemedText>
            <ThemedText style={styles.currentDate}>
              {formatDate(currentTime)}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Prayer Times Grid */}
        <ThemedView style={styles.prayerTimesSection}>
          <ThemedText style={styles.sectionTitle}>Prayer Times</ThemedText>
          {locationLoading ? (
            <ThemedText style={styles.loadingText}>Getting location...</ThemedText>
          ) : locationError ? (
            <ThemedText style={styles.errorText}>
              Unable to get location. Please enable location access in settings.
            </ThemedText>
          ) : prayerTimes.length > 0 ? (
            <View style={styles.prayerTimesGrid}>
              {prayerTimes.map((prayer, index) => (
                <View key={prayer.name} style={styles.prayerTimeCard}>
                  <View style={styles.prayerIconContainer}>
                    <IconSymbol
                      name={prayer.icon as any}
                      size={24}
                      color="#22C55E"
                    />
                  </View>
                  <ThemedText style={styles.prayerName}>{prayer.name}</ThemedText>
                  <ThemedText style={styles.prayerTime}>{prayer.time}</ThemedText>
                </View>
              ))}
            </View>
          ) : (
            <ThemedText style={styles.loadingText}>Loading prayer times...</ThemedText>
          )}
        </ThemedView>

        {/* Books Section */}
        <ThemedView style={styles.booksSection}>
          <ThemedView style={styles.booksHeader}>
            <ThemedText style={styles.booksTitle}>
              Quran & Hadith Books
            </ThemedText>
            <ThemedText style={styles.booksSubtitle}>
              {books.length} books available
            </ThemedText>
          </ThemedView>

          <View style={styles.booksGrid}>
            {currentBooks.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                onPress={() => handleBookPress(book)}
              >
                <Image
                  source={book.image}
                  style={{ width: "100%", height: 150 }}
                  resizeMode="contain"
                />
                <ThemedText style={styles.bookTitle} numberOfLines={2}>
                  {book.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {renderPagination()}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
});

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Light background
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC", // Light background
  },
  // Header Section
  headerSection: {
    marginBottom: 24,
  },
  timeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    gap: 10,
  },
  currentTime: {
    fontSize: 48,
    fontWeight: "800",
    color: "#1F2937",
    lineHeight: 48,
  },
  currentDate: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  // Next Prayer Section
  nextPrayerSection: {
    backgroundColor: "#22C55E",
  },
  nextPrayerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E",
    padding: 24,
  },
  nextPrayerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  nextPrayerInfo: {
    flex: 1,
  },
  nextPrayerName: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  nextPrayerTime: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  nextPrayerRelativeTime: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    opacity: 0.9,
    marginTop: 4,
  },
  // Prayer Times Section
  prayerTimesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "left",
    letterSpacing: -0.5,
  },
  prayerTimesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  prayerTimeCard: {},
  prayerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  prayerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
    textAlign: "center",
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: "700",
    color: "#22C55E",
    textAlign: "center",
  },
  // Books Section
  booksSection: {
    marginBottom: 32,
  },
  booksHeader: {
    marginBottom: 10,
  },
  booksTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "left",
  },
  booksSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    gap: 15,
  },
  bookCard: {
    width: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    minHeight: 140,
    justifyContent: "center",
    paddingVertical: 10,
  },

  bookTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    lineHeight: 20,
  },
  // Pagination
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 20,
  },
  paginationButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 16,
    color: "#374151",
  },
  // Loading
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "500",
    paddingHorizontal: 20,
  },
});
