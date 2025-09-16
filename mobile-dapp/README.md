# Herb Traceability Mobile DApp

React Native (Expo) mobile app for Ayurvedic herb traceability.

## Features
- Offline-first: Events saved locally (SQLite) when offline
- GPS capture and timestamp for CollectionEvent
- Syncs to blockchain via API Gateway when online
- Simple UI for logging and syncing events

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Start Expo:
   ```
   npm start
   ```
3. Run on your device or emulator (scan QR code from Expo CLI)

## Usage
- Log a new CollectionEvent with GPS, timestamp, species, and quality fields
- View unsynced events and sync them to the blockchain when online

## API Gateway
- Set the API URL in `src/services/api.js` to your deployed API Gateway endpoint
