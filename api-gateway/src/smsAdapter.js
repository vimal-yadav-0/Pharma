const express = require('express');
const { submitTransaction } = require('./fabricClient');
const router = express.Router();

// Example: SMS body format: COLLECT|species|moisture|pesticide|dnaBarcode|lat|lng|collectorId
// e.g. COLLECT|Withania somnifera|8.5|false|true|19.1|73.5|COL123

router.post('/sms-webhook', async (req, res) => {
  const body = req.body.Body || req.body.body;
  if (!body) return res.status(400).send('No SMS body');
  const parts = body.split('|');
  if (parts[0] !== 'COLLECT' || parts.length < 8) return res.status(400).send('Invalid SMS format');
  const event = {
    id: `COL${Date.now()}`,
    gps: { lat: parseFloat(parts[5]), lng: parseFloat(parts[6]) },
    timestamp: new Date().toISOString(),
    species: parts[1],
    collectorId: parts[7],
    quality: {
      moisture: parseFloat(parts[2]),
      pesticide: parts[3] === 'true',
      dnaBarcode: parts[4] === 'true'
    }
  };
  try {
    await submitTransaction('recordCollectionEvent', JSON.stringify(event));
    res.status(200).send('Event recorded');
  } catch (err) {
    res.status(500).send('Blockchain error: ' + err.message);
  }
});

module.exports = router;
