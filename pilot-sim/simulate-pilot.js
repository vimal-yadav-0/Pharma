const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:3000';
const sample = JSON.parse(fs.readFileSync('./sample-data.json', 'utf8'));

async function login(username, password) {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  return res.data.token;
}

async function postEvent(endpoint, data, token) {
  await axios.post(`${API_URL}/${endpoint}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

(async () => {
  try {
    // 1. Farmer logs CollectionEvent
    const farmerToken = await login('farmer', 'farmerpw');
    await postEvent('collection-event', sample.events.collectionEvent, farmerToken);
    console.log('CollectionEvent submitted');

    // 2. Processor adds ProcessingStep
    const processorToken = await login('processor', 'processorpw');
    await postEvent('processing-step', sample.events.processingStep, processorToken);
    console.log('ProcessingStep submitted');

    // 3. Lab uploads QualityTest
    const labToken = await login('lab', 'labpw');
    await postEvent('quality-test', sample.events.qualityTest, labToken);
    console.log('QualityTest submitted');

    // 4. Manufacturer creates Provenance
    const manufacturerToken = await login('manufacturer', 'manufacturerpw');
    await postEvent('provenance', sample.events.provenance, manufacturerToken);
    console.log('Provenance submitted');

    // 5. Consumer fetches provenance
    const res = await axios.get(`${API_URL}/event/${sample.events.provenance.batchId}`);
    console.log('Provenance fetched:', res.data);
  } catch (err) {
    console.error('Simulation error:', err.response ? err.response.data : err.message);
  }
})();
