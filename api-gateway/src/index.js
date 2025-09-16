const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { submitTransaction, evaluateTransaction } = require('./fabricClient');
const { authenticateJWT, users, JWT_SECRET } = require('./auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const smsAdapter = require('./smsAdapter');
const erpLimsAdapter = require('./erpLimsAdapter');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // For Twilio webhook

// Mount SMS webhook
app.use('/sms-webhook', smsAdapter);
app.use('/erp', erpLimsAdapter);
app.use('/lims', erpLimsAdapter);

// POST /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// POST /collection-event
app.post('/collection-event', authenticateJWT, async (req, res) => {
  try {
    const payload = JSON.stringify(req.body);
    await submitTransaction('recordCollectionEvent', payload);
    res.status(201).json({ message: 'CollectionEvent recorded' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /processing-step
app.post('/processing-step', authenticateJWT, async (req, res) => {
  try {
    const payload = JSON.stringify(req.body);
    await submitTransaction('addProcessingStep', payload);
    res.status(201).json({ message: 'ProcessingStep added' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /quality-test
app.post('/quality-test', authenticateJWT, async (req, res) => {
  try {
    const payload = JSON.stringify(req.body);
    await submitTransaction('uploadQualityTest', payload);
    res.status(201).json({ message: 'QualityTest uploaded' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /provenance
app.post('/provenance', authenticateJWT, async (req, res) => {
  try {
    const payload = JSON.stringify(req.body);
    await submitTransaction('createProvenance', payload);
    res.status(201).json({ message: 'Provenance created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /fhir-bundle
app.post('/fhir-bundle', authenticateJWT, async (req, res) => {
  const bundle = req.body;
  if (!bundle || bundle.resourceType !== 'Bundle' || !Array.isArray(bundle.entry)) {
    return res.status(400).json({ error: 'Invalid FHIR Bundle' });
  }
  const responseEntries = [];
  for (const entry of bundle.entry) {
    try {
      let fn, payload;
      switch (entry.resource.resourceType) {
        case 'CollectionEvent':
          fn = 'recordCollectionEvent';
          payload = entry.resource;
          break;
        case 'ProcessingStep':
          fn = 'addProcessingStep';
          payload = entry.resource;
          break;
        case 'QualityTest':
          fn = 'uploadQualityTest';
          payload = entry.resource;
          break;
        case 'Provenance':
          fn = 'createProvenance';
          payload = entry.resource;
          break;
        default:
          responseEntries.push({ response: { status: '400', outcome: { issue: [{ details: { text: 'Unknown resourceType' } }] } } });
          continue;
      }
      await submitTransaction(fn, JSON.stringify(payload));
      responseEntries.push({ response: { status: '201', outcome: { issue: [{ details: { text: 'Success' } }] } } });
    } catch (err) {
      responseEntries.push({ response: { status: '400', outcome: { issue: [{ details: { text: err.message } }] } } });
    }
  }
  res.json({ resourceType: 'Bundle', type: 'transaction-response', entry: responseEntries });
});

// GET /event/:id
app.get('/event/:id', async (req, res) => {
  try {
    const result = await evaluateTransaction('readEvent', req.params.id);
    res.json(JSON.parse(result));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
