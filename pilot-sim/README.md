# Ashwagandha Traceability Pilot Simulation

This directory contains sample data and a simulation script to demonstrate the end-to-end traceability flow for Ashwagandha using the blockchain system.

## Sample Data
- 5 sample farmers
- 1 processor, 1 lab, 1 manufacturer
- Example events for CollectionEvent, ProcessingStep, QualityTest, Provenance

## How to Run
1. Ensure the API Gateway is running at http://localhost:3000
2. Install dependencies:
   ```
   npm install axios
   ```
3. Run the simulation script:
   ```
   node simulate-pilot.js
   ```

## What Happens
- Simulates:
  1. Farmer logs a CollectionEvent
  2. Processor adds a ProcessingStep
  3. Lab uploads a QualityTest
  4. Manufacturer creates Provenance
  5. Consumer fetches the provenance record

- Output will show each step and the final provenance data as fetched from the blockchain.
