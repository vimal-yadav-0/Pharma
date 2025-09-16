# Example Transaction Flow

## 1. CollectionEvent
**Payload:**
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
**Invoke:**
```
peer chaincode invoke -C herbchannel -n herbtrace -c '{"function":"recordCollectionEvent","Args":["<payload as string>"]}'
```

---

## 2. ProcessingStep
**Payload:**
```
{
  "id": "PROC456",
  "stepType": "Drying",
  "details": "Sun-dried for 3 days",
  "timestamp": "2025-11-03T10:00:00Z",
  "operatorId": "PROC456"
}
```
**Invoke:**
```
peer chaincode invoke -C herbchannel -n herbtrace -c '{"function":"addProcessingStep","Args":["<payload as string>"]}'
```

---

## 3. QualityTest
**Payload:**
```
{
  "id": "LAB789",
  "labId": "LAB789",
  "testType": "HPTLC",
  "results": { "marker": "Withaferin A", "value": 0.5 },
  "certificateHash": "Qm123abc..."
}
```
**Invoke:**
```
peer chaincode invoke -C herbchannel -n herbtrace -c '{"function":"uploadQualityTest","Args":["<payload as string>"]}'
```

---

## 4. Provenance
**Payload:**
```
{
  "batchId": "BATCH001",
  "linkedEvents": ["COL123", "PROC456", "LAB789"],
  "finalProductDetails": { "name": "Ashwagandha Capsules", "packDate": "2025-11-10" }
}
```
**Invoke:**
```
peer chaincode invoke -C herbchannel -n herbtrace -c '{"function":"createProvenance","Args":["<payload as string>"]}'
```

---

## 5. Query Example
**Read any event by ID:**
```
peer chaincode query -C herbchannel -n herbtrace -c '{"function":"readEvent","Args":["COL123"]}'
```
