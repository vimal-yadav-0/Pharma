const express = require('express');
const { submitTransaction } = require('./fabricClient');
const router = express.Router();

// POST /erp/mock - Simulate ERP system sending a ProcessingStep
router.post('/erp/mock', async (req, res) => {
  try {
    const event = req.body;
    await submitTransaction('addProcessingStep', JSON.stringify(event));
    res.status(201).json({ message: 'ERP event processed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /lims/mock - Simulate LIMS system sending a QualityTest
router.post('/lims/mock', async (req, res) => {
  try {
    const event = req.body;
    await submitTransaction('uploadQualityTest', JSON.stringify(event));
    res.status(201).json({ message: 'LIMS event processed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
