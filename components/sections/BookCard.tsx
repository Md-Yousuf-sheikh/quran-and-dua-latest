import { ThemedText } from "@/components/themed-text";
import React from "react";
import { Image, TouchableOpacity } from "react-native";

interface PDFBook {
  id: string;
  name: string;
  path: string;
  image: any;
}

interface BookCardProps {
  book: PDFBook;
  onPress: (book: PDFBook) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => onPress(book)}
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
  );
};

const styles = {
  bookCard: {
    width: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center" as const,
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
    justifyContent: "center" as const,
    paddingVertical: 10,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
    textAlign: "center" as const,
    lineHeight: 20,
  },
};
