import { useRouter } from "expo-router";
import moment from "moment-timezone";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";

import {
  BooksSection,
  HeaderSection,
  NextPrayerSection,
  PrayerTimesSection,
  ReminderNotificationCard,
} from "@/components/sections";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import {
  getNextPrayerTime,
  getPrayerTimes,
  getTimeUntilNextPrayer,
  PrayerTimeData,
} from "@/utils/prayerTimes";
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
  const {
    location,
    error: locationError,
    loading: locationLoading,
  } = useCurrentLocation();

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
    return moment(date).format("hh:mm A");
  }, []);

  const formatDate = useCallback((date: Date) => {
    return moment(date).format("dddd, MMMM Do YYYY");
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

  const handleBookPress = useCallback(
    (book: PDFBook) => {
      router.push({
        pathname: "/book-detail",
        params: {
          bookName: book.name,
          bookPath: book.path,
        },
      });
    },
    [router]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

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
      <NextPrayerSection
        locationLoading={locationLoading}
        locationError={locationError}
        nextPrayer={nextPrayer}
        timeUntilNextPrayer={timeUntilNextPrayer}
        paddingTop={top}
      />
      
      <ThemedView style={styles.container}>
        <HeaderSection
          currentTime={currentTime}
          formatTime={formatTime}
          formatDate={formatDate}
        />

        <PrayerTimesSection
          locationLoading={locationLoading}
          locationError={locationError}
          prayerTimes={prayerTimes}
        />

        <BooksSection
          books={books}
          currentBooks={currentBooks}
          currentPage={currentPage}
          totalPages={totalPages}
          onBookPress={handleBookPress}
          onPageChange={handlePageChange}
        />

        <ReminderNotificationCard />
      </ThemedView>
    </ScrollView>
  );
});

HomeScreen.displayName = "HomeScreen";

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
  // Loading
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
});
