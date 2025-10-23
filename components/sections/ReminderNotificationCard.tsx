import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { TouchableOpacity } from "react-native";

interface ReminderNotificationCardProps {
  onPress?: () => void;
}

export const ReminderNotificationCard: React.FC<
  ReminderNotificationCardProps
> = ({ onPress }) => {
  const reminders = [
    "Remember to read Quran daily",
    "Say Bismillah before eating",
    "Pray on time",
    "Make dua for others",
    "Be grateful for Allah's blessings",
    "Help those in need",
    "Forgive others as Allah forgives you",
    "Keep your heart pure",
  ];

  const randomReminder =
    reminders[Math.floor(Math.random() * reminders.length)];

  return (
    <TouchableOpacity
      style={styles.reminderCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ThemedView style={styles.reminderContent}>
        <ThemedView style={styles.reminderTextContainer}>
          <ThemedText style={styles.reminderTitle}>Daily Reminder</ThemedText>
          <ThemedText style={styles.reminderMessage}>
            &quot;{randomReminder}&quot;
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = {
  reminderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden" as const,
  },
  reminderContent: {
    padding: 20,
  },
  reminderTextContainer: {
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "left" as const,
    fontStyle: "italic" as const,
  },
  reminderMessage: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    textAlign: "left" as const,
    fontStyle: "italic" as const,
  },
};
