import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { View } from "react-native";
import { BookCard } from "./BookCard";
import { Pagination } from "./Pagination";

interface PDFBook {
  id: string;
  name: string;
  path: string;
  image: any;
}

interface BooksSectionProps {
  books: PDFBook[];
  currentBooks: PDFBook[];
  currentPage: number;
  totalPages: number;
  onBookPress: (book: PDFBook) => void;
  onPageChange: (page: number) => void;
}

export const BooksSection: React.FC<BooksSectionProps> = ({
  books,
  currentBooks,
  currentPage,
  totalPages,
  onBookPress,
  onPageChange,
}) => {
  return (
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
          <BookCard
            key={book.id}
            book={book}
            onPress={onBookPress}
          />
        ))}
      </View>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </ThemedView>
  );
};

const styles = {
  booksSection: {
    marginBottom: 32,
  },
  booksHeader: {
    marginBottom: 10,
  },
  booksTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#1F2937",
    textAlign: "left" as const,
  },
  booksSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  booksGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 15,
  },
};
