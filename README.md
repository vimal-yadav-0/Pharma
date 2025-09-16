# Herb Traceability Chaincode

This Hyperledger Fabric chaincode implements the blockchain foundation for an Ayurvedic herb traceability system. It enforces:
- Geo-fencing (approved harvesting zones)
- Seasonal harvest rules
- Quality thresholds (moisture, pesticide, DNA barcode checks)

## Event Schemas

### CollectionEvent
```
{
  "id": "COL123",
  "gps": { "lat": 19.1, "lng": 73.5 },
  "timestamp": "2025-11-01T10:00:00Z",
  "species": "Withania somnifera",
  "collectorId": "COL123",
  "quality": {
    "moisture": 8.5,
    "pesticide": false,
    "dnaBarcode": true
  }
}
```

### ProcessingStep
```
{
  "id": "PROC456",
  "stepType": "Drying",
  "details": "Sun-dried for 3 days",
  "timestamp": "2025-11-03T10:00:00Z",
  "operatorId": "PROC456"
}
```

### QualityTest
```
{
  "id": "LAB789",
  "labId": "LAB789",
  "testType": "HPTLC",
  "results": { "marker": "Withaferin A", "value": 0.5 },
  "certificateHash": "Qm123abc..."
}
```

### Provenance
```
{
  "batchId": "BATCH001",
  "linkedEvents": ["COL123", "PROC456", "LAB789"],
  "finalProductDetails": { "name": "Ashwagandha Capsules", "packDate": "2025-11-10" }
}
```

## Build & Deploy

1. Install dependencies:
   ```
   npm install
   ```
2. Build the chaincode:
   ```
   npm run build
   ```
3. Package for Fabric deployment:
   ```
   mkdir -p dist && cp package.json dist/ && cp -r dist/* dist/
   # Use Fabric CLI or scripts to install/instantiate chaincode
   ```

## Contract Functions
- `recordCollectionEvent(eventStr)`
- `addProcessingStep(stepStr)`
- `uploadQualityTest(testStr)`
- `createProvenance(provenanceStr)`
- `readEvent(id)`

## Validation Logic
- CollectionEvent: Enforces geo-fencing, season, and quality thresholds.
- Other events: Basic storage, can be extended for further validation.
