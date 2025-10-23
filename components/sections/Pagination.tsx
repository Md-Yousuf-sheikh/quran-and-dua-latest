import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { TouchableOpacity } from "react-native";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <ThemedView style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === 1 && styles.disabledButton,
        ]}
        onPress={() => onPageChange(Math.max(1, currentPage - 1))}
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
        onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
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
};

const styles = {
  paginationContainer: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
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
    fontWeight: "600" as const,
    marginHorizontal: 16,
    color: "#374151",
  },
};
