import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";

interface HeaderSectionProps {
  currentTime: Date;
  formatTime: (date: Date) => string;
  formatDate: (date: Date) => string;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  currentTime,
  formatTime,
  formatDate,
}) => {
  return (
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
  );
};

const styles = {
  headerSection: {
    marginBottom: 24,
  },
  timeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center" as const,
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
    fontWeight: "800" as const,
    color: "#1F2937",
    lineHeight: 48,
  },
  currentDate: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500" as const,
  },
};
