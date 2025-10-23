import { ThemedView } from "@/components/themed-view";
import React from "react";
import { ThemedText } from "../themed-text";

interface NextPrayerSectionProps {
  locationLoading: boolean;
  locationError: string | null;
  nextPrayer: { name: string; time: string } | null;
  timeUntilNextPrayer: string;
  paddingTop: number;
}

export const NextPrayerSection: React.FC<NextPrayerSectionProps> = ({
  locationLoading,
  locationError,
  nextPrayer,
  timeUntilNextPrayer,
  paddingTop,
}) => {
  return (
    <ThemedView style={[styles.nextPrayerSection, { paddingTop }]}>
      <ThemedView style={styles.nextPrayerCard}>
        {/* <View style={styles.nextPrayerInfo}>
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
        </View> */}
        <ThemedText style={styles.nextPrayerName}>Quran & Dua</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = {
  nextPrayerSection: {
    backgroundColor: "#22C55E",
  },
  nextPrayerCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#22C55E",
    padding: 24,
  },
  nextPrayerInfo: {
    flex: 1,
  },
  nextPrayerName: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "800" as const,
  },
  nextPrayerTime: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "800" as const,
  },
  nextPrayerRelativeTime: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600" as const,
    opacity: 0.9,
    marginTop: 4,
  },
};
