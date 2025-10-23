import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PrayerTimeData } from "@/utils/prayerTimes";
import moment from "moment-timezone";
import React from "react";
import { View } from "react-native";

interface PrayerTimesSectionProps {
  locationLoading: boolean;
  locationError: string | null;
  prayerTimes: PrayerTimeData[];
}

export const PrayerTimesSection: React.FC<PrayerTimesSectionProps> = ({
  locationLoading,
  locationError,
  prayerTimes,
}) => {
  return (
    <ThemedView style={styles.prayerTimesSection}>
      <ThemedText style={styles.sectionTitle}>Prayer Times</ThemedText>
      {locationLoading ? (
        <ThemedText style={styles.loadingText}>
          Getting location...
        </ThemedText>
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
              <ThemedText style={styles.prayerName}>
                {prayer.name}
              </ThemedText>
              <ThemedText style={styles.prayerTime}>
                {moment(prayer.dateTime).format("hh:mm A")}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : (
        <ThemedText style={styles.loadingText}>
          Loading prayer times...
        </ThemedText>
      )}
    </ThemedView>
  );
};

const styles = {
  prayerTimesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "left" as const,
    letterSpacing: -0.5,
  },
  prayerTimesGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    justifyContent: "space-between" as const,
  },
  prayerTimeCard: {},
  prayerIconContainer: {
    height: 40,
    borderRadius: 24,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 3,
  },
  prayerName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
    textAlign: "center" as const,
  },
  prayerTime: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#22C55E",
    textAlign: "center" as const,
  },
  loadingText: {
    textAlign: "center" as const,
    marginTop: 50,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500" as const,
  },
  errorText: {
    textAlign: "center" as const,
    marginTop: 20,
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "500" as const,
    paddingHorizontal: 20,
  },
};
