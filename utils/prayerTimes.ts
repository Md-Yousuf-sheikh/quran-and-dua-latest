import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';
import moment from 'moment-timezone';

export interface PrayerTimeData {
  name: string;
  time: string;
  icon: string;
  dateTime: Date;
  relativeTime?: string; // Time until this prayer (e.g., "in 2 hours")
}

// Helper function to format time in 24-hour format using Moment.js
const formatTime24Hour = (date: Date): string => {
  return moment(date).format('HH:mm');
};

// Helper function to get timezone from coordinates (simplified)
// const getTimezoneFromCoordinates = (lat: number, lon: number): string => {
//   // This is a simplified approach - in production you might want to use a more sophisticated timezone detection
//   // For now, we'll use the system timezone
//   return moment.tz.guess();
// };

// Cache for prayer times to avoid recalculating for same inputs
const prayerTimesCache = new Map<string, PrayerTimeData[]>();

export function getPrayerTimes(lat: number, lon: number, date = new Date()): PrayerTimeData[] {
  // Create cache key based on coordinates and date
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)},${date.toDateString()}`;
  
  // Check cache first
  if (prayerTimesCache.has(cacheKey)) {
    return prayerTimesCache.get(cacheKey)!;
  }

  const coordinates = new Coordinates(lat, lon);

  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Shafi;

  const prayerTimes = new PrayerTimes(coordinates, date, params);
  
  const result = [
    { 
      name: "Fajr", 
      time: formatTime24Hour(prayerTimes.fajr), 
      icon: "sunrise.fill",
      dateTime: prayerTimes.fajr,
      relativeTime: moment(prayerTimes.fajr).fromNow()
    },
    { 
      name: "Sunrise", 
      time: formatTime24Hour(prayerTimes.sunrise), 
      icon: "sun.max.fill",
      dateTime: prayerTimes.sunrise,
      relativeTime: moment(prayerTimes.sunrise).fromNow()
    },
    { 
      name: "Dhuhr", 
      time: formatTime24Hour(prayerTimes.dhuhr), 
      icon: "sun.max.fill",
      dateTime: prayerTimes.dhuhr,
      relativeTime: moment(prayerTimes.dhuhr).fromNow()
    },
    { 
      name: "Asr", 
      time: formatTime24Hour(prayerTimes.asr), 
      icon: "sun.min.fill",
      dateTime: prayerTimes.asr,
      relativeTime: moment(prayerTimes.asr).fromNow()
    },
    { 
      name: "Maghrib", 
      time: formatTime24Hour(prayerTimes.maghrib), 
      icon: "sunset.fill",
      dateTime: prayerTimes.maghrib,
      relativeTime: moment(prayerTimes.maghrib).fromNow()
    },
    { 
      name: "Isha", 
      time: formatTime24Hour(prayerTimes.isha), 
      icon: "moon.fill",
      dateTime: prayerTimes.isha,
      relativeTime: moment(prayerTimes.isha).fromNow()
    },
  ];

  // Cache the result
  prayerTimesCache.set(cacheKey, result);
  
  return result;
}

export function getNextPrayerTime(prayerTimes: PrayerTimeData[], currentTime: Date): PrayerTimeData | null {
  const currentMoment = moment(currentTime);

  // Find the next prayer time using Moment.js
  const nextPrayer = prayerTimes.find((prayer) => {
    const prayerMoment = moment(prayer.dateTime);
    return prayerMoment.isAfter(currentMoment);
  });

  // If no prayer time found for today, return the first prayer of tomorrow (Fajr)
  return nextPrayer || prayerTimes[0] || null;
}

// New function to get time until next prayer using Moment.js
export function getTimeUntilNextPrayer(prayerTimes: PrayerTimeData[], currentTime: Date): string {
  const nextPrayer = getNextPrayerTime(prayerTimes, currentTime);
  if (!nextPrayer) return 'No prayer times available';
  
  const nextPrayerMoment = moment(nextPrayer.dateTime);
  const currentMoment = moment(currentTime);
  
  return nextPrayerMoment.from(currentMoment);
}
