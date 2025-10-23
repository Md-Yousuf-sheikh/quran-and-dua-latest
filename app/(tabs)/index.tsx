import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface PDFBook {
  id: string;
  name: string;
  path: string;
}

const ITEMS_PER_PAGE = 6;

export default function HomeScreen() {
  const [books, setBooks] = useState<PDFBook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadPDFBooks();
  }, []);

  const loadPDFBooks = async () => {
    try {
      setLoading(true);
      
      // For development, we'll use the static list since we know the files exist
      const pdfBooks: PDFBook[] = [
        {
          id: '1',
          name: 'Hafezi Quran',
          path: 'Hafezi-Quran.pdf'
        },
        {
          id: '2', 
          name: 'The Noble Quran',
          path: 'The-noble-Quran.pdf'
        }
      ];
      
      setBooks(pdfBooks);
    } catch (error) {
      console.error('Error loading PDF books:', error);
      Alert.alert('Error', 'Failed to load PDF books');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBooks = books.slice(startIndex, endIndex);

  const handleBookPress = (book: PDFBook) => {
    router.push({
      pathname: '/pdf-viewer',
      params: { 
        bookName: book.name,
        bookPath: book.path 
      }
    });
  };

  const renderBookItem = ({ item }: { item: PDFBook }) => (
    <TouchableOpacity 
      style={styles.bookCard} 
      onPress={() => handleBookPress(item)}
    >
      <ThemedView style={styles.bookIcon}>
        <IconSymbol name="doc.text.fill" size={40} color="#007AFF" />
      </ThemedView>
      <ThemedText style={styles.bookTitle} numberOfLines={2}>
        {item.name}
      </ThemedText>
    </TouchableOpacity>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <ThemedView style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <IconSymbol name="chevron.left" size={20} color={currentPage === 1 ? '#999' : '#007AFF'} />
        </TouchableOpacity>

        <ThemedText style={styles.pageInfo}>
          {currentPage} of {totalPages}
        </ThemedText>

        <TouchableOpacity
          style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
          onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <IconSymbol name="chevron.right" size={20} color={currentPage === totalPages ? '#999' : '#007AFF'} />
        </TouchableOpacity>
      </ThemedView>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>Loading books...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Quran & Hadith Books</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {books.length} books available
        </ThemedText>
      </ThemedView>

      <FlatList
        data={currentBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={false}
      />

      {renderPagination()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  booksList: {
    paddingBottom: 20,
  },
  bookCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  bookIcon: {
    marginBottom: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 16,
  },
  paginationButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    marginHorizontal: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
  },
});
