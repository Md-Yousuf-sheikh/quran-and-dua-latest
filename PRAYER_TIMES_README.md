# Prayer Times Feature

This app now includes location-based prayer times using the `adhan` library and `expo-location`.

## Features

- **Location-based Prayer Times**: Automatically calculates prayer times based on your current location
- **Real-time Updates**: Prayer times update automatically based on your location
- **Next Prayer Highlight**: Shows the next upcoming prayer time prominently
- **Permission Handling**: Gracefully handles location permission requests

## Dependencies Added

- `expo-location`: For getting user's current location
- `adhan`: For calculating Islamic prayer times
- `luxon`: For date/time formatting

## How It Works

1. **Location Hook** (`hooks/useCurrentLocation.ts`):
   - Requests location permission from the user
   - Gets current GPS coordinates
   - Handles permission errors gracefully

2. **Prayer Times Utility** (`utils/prayerTimes.ts`):
   - Uses the `adhan` library to calculate prayer times
   - Supports different calculation methods (currently using Muslim World League)
   - Formats times using Luxon for consistent display

3. **Main Component** (`app/index.tsx`):
   - Integrates location and prayer times
   - Shows loading states while getting location
   - Displays error messages if location access is denied
   - Updates prayer times when location changes

## Usage

The prayer times will automatically appear once the user grants location permission. The app will:

1. Request location permission on first load
2. Calculate prayer times based on current location
3. Display the next upcoming prayer prominently
4. Show all daily prayer times in a grid

## Error Handling

- If location permission is denied, the app shows an error message
- If location cannot be obtained, appropriate fallback messages are shown
- Loading states are displayed while processing location data

## Customization

You can modify the prayer time calculation by editing `utils/prayerTimes.ts`:

- Change calculation method (currently Muslim World League)
- Adjust madhab (currently Shafi)
- Modify time formatting
- Add additional prayer times if needed

## Testing

To test the prayer times calculation, you can run:

```bash
node test-prayer-times.js
```

This will show prayer times for New York coordinates as an example.
