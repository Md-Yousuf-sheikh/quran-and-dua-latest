import {
  Hafezi_Quran_Para_data,
  Hafezi_Quran_Surah_data,
} from "@/src/data/books-tarjama";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SurahData {
  name: string;
  page: number;
}

interface ParaData {
  name: string;
  page: number;
}

export default function BookDetailScreen() {
  const { bookName, bookPath } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const [lastReadPage, setLastReadPage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"surah" | "para">("surah");

  const loadLastReadPage = useCallback(async () => {
    try {
      const key = `lastReadPage_${bookPath}`;
      const savedPage = await AsyncStorage.getItem(key);
      if (savedPage) {
        setLastReadPage(parseInt(savedPage, 10));
      }
    } catch (error) {
      console.error("Error loading last read page:", error);
    }
  }, [bookPath]);

  useEffect(() => {
    loadLastReadPage();
  }, [loadLastReadPage]);

  // Refresh last read page when user returns to this screen
  useFocusEffect(
    useCallback(() => {
      loadLastReadPage();
    }, [loadLastReadPage])
  );

  const handleBack = () => {
    router.back();
  };

  const handleItemPress = useCallback(
    (page: number) => {
      // Basic validation - page should be positive
      if (page < 1) {
        Alert.alert("Invalid Page", "Page number must be greater than 0");
        return;
      }

      router.push({
        pathname: "/pdf-viewer",
        params: {
          bookName: bookName,
          bookPath: bookPath,
          initialPage: page.toString(),
        },
      });
    },
    [router, bookName, bookPath]
  );

  const handleContinueReading = useCallback(() => {
    if (lastReadPage) {
      handleItemPress(lastReadPage);
    }
  }, [lastReadPage, handleItemPress]);

  const renderSurahCard = useCallback(
    ({ item, index }: { item: SurahData; index: number }) => (
      <TouchableOpacity
        key={index}
        style={styles.itemCard}
        onPress={() => handleItemPress(item.page)}
      >
        <View style={styles.itemContent}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPage}>Page {item.page}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>
    ),
    [handleItemPress]
  );

  const renderParaCard = useCallback(
    ({ item, index }: { item: ParaData; index: number }) => (
      <TouchableOpacity
        key={index}
        style={styles.itemCard}
        onPress={() => handleItemPress(item.page)}
      >
        <View style={styles.itemContent}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPage}>Page {item.page}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>
    ),
    [handleItemPress]
  );

  const keyExtractor = useCallback(
    (item: SurahData | ParaData, index: number) => `${item.name}-${index}`,
    []
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{bookName}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.scrollContainer}>
        {/* Last Read Section */}
        {lastReadPage && (
          <View style={styles.lastReadSection}>
            <Text style={styles.lastReadTitle}>Continue Reading</Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinueReading}
            >
              <View style={styles.continueContent}>
                <Ionicons name="book" size={24} color="#22C55E" />
                <View style={styles.continueInfo}>
                  <Text style={styles.continueText}>Page {lastReadPage}</Text>
                  <Text style={styles.continueSubtext}>
                    Tap to continue reading
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#22C55E" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "surah" && styles.activeTab]}
            onPress={() => setActiveTab("surah")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "surah" && styles.activeTabText,
              ]}
            >
              Surah ({Hafezi_Quran_Surah_data.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "para" && styles.activeTab]}
            onPress={() => setActiveTab("para")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "para" && styles.activeTabText,
              ]}
            >
              Para ({Hafezi_Quran_Para_data.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === "surah" ? (
            <FlatList
              data={Hafezi_Quran_Surah_data}
              renderItem={renderSurahCard}
              keyExtractor={keyExtractor}
              style={styles.listContainer}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={15}
              windowSize={10}
              getItemLayout={(data, index) => ({
                length: 80, // Approximate height of each item
                offset: 80 * index,
                index,
              })}
            />
          ) : (
            <FlatList
              data={Hafezi_Quran_Para_data}
              renderItem={renderParaCard}
              keyExtractor={keyExtractor}
              style={styles.listContainer}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={15}
              windowSize={10}
              getItemLayout={(data, index) => ({
                length: 80, // Approximate height of each item
                offset: 80 * index,
                index,
              })}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#22C55E",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  lastReadSection: {
    paddingHorizontal: 15,
    backgroundColor: "white",
    paddingVertical: 8,
  },
  lastReadTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  continueContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  continueInfo: {
    flex: 1,
    marginLeft: 12,
  },
  continueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#22C55E",
  },
  continueSubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 15,
    marginBottom: 5,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#22C55E",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  listContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    flex: 1,
  },
  itemCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 80, // Fixed height for better performance
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemPage: {
    fontSize: 14,
    color: "#6B7280",
  },
});
