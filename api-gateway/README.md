# Herb Traceability API Gateway

Node.js/Express API gateway for the Ayurvedic herb traceability blockchain system.

## Features
- RESTful endpoints for all traceability events
- Connects to Hyperledger Fabric chaincode via Fabric SDK
- JWT-based authentication for secure event submission
- SMS-over-blockchain fallback (Twilio webhook)
- FHIR-style JSON bundle support for batch event submission
- Mock ERP/LIMS adapter endpoints for integration simulation

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Copy and edit `.env.example` to `.env` with your Fabric network details, set `JWT_SECRET`, and Twilio credentials.
3. Start the server:
   ```
   npm start
   ```

## Environment Variables
- CONNECTION_PROFILE: Path to Fabric connection profile JSON
- WALLET_PATH: Path to Fabric wallet directory
- USER_ID: Fabric user identity
- CHANNEL_NAME: Fabric channel name
- CHAINCODE_NAME: Chaincode name
- PORT: API server port
- JWT_SECRET: Secret for signing JWT tokens
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER: For SMS fallback

## Authentication
- Use `POST /login` with `{ "username": "farmer", "password": "farmerpw" }` (or processor/lab/manufacturer)
- Use the returned JWT as `Authorization: Bearer <token>` for all event submission endpoints

## Endpoints
- `POST /login` — Get JWT token
- `POST /collection-event` — Record a CollectionEvent (JWT required)
- `POST /processing-step` — Add a ProcessingStep (JWT required)
- `POST /quality-test` — Upload a QualityTest (JWT required)
- `POST /provenance` — Create Provenance (JWT required)
- `POST /fhir-bundle` — Submit a FHIR Bundle of events (JWT required)
- `GET /event/:id` — Query any event by ID (public)
- `POST /sms-webhook` — Twilio webhook for SMS fallback (public)
- `POST /erp/mock` — Mock ERP system sends ProcessingStep (public, for integration simulation)
- `POST /lims/mock` — Mock LIMS system sends QualityTest (public, for integration simulation)

### Example: ERP/LIMS Integration
```
curl -X POST http://localhost:3000/erp/mock \
  -H "Content-Type: application/json" \
  -d '{ "id": "PROC999", "stepType": "Grinding", ... }'

curl -X POST http://localhost:3000/lims/mock \
  -H "Content-Type: application/json" \
  -d '{ "id": "LAB999", "labId": "LAB999", ... }'
```

## FHIR-style JSON Bundles
- Use `/fhir-bundle` to submit multiple events in a single request
- Response is a FHIR transaction-response bundle with status for each entry
