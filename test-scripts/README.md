# Test Scripts

This directory contains basic test scripts for the Ayurvedic herb traceability system.

## Throughput Test
- `throughput-test.js`: Submits 50 CollectionEvents in parallel and measures average response time.
- Run:
  ```
  node throughput-test.js
  ```

## Offline Sync Test
- `offline-sync-test.js`: Simulates storing events offline and syncing them in batch when online.
- Run:
  ```
  node offline-sync-test.js
  ```

## QR Validation Test
- `qr-validation-test.js`: Generates a QR code for a batch ID and simulates scanning/lookup via the consumer portal API.
- Run:
  ```
  npm install qrcode
  node qr-validation-test.js
  ```
