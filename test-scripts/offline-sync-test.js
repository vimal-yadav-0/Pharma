const axios = require('axios');

const API_URL = 'http://localhost:3000';
const NUM_EVENTS = 10;

function makeEvent(i) {
  return {
    id: `COLOFF${i}`,
    gps: { lat: 19.2 + i * 0.01, lng: 73.6 + i * 0.01 },
    timestamp: new Date().toISOString(),
    species: 'Withania somnifera',
    collectorId: 'FARMER2',
    quality: { moisture: 8.5, pesticide: false, dnaBarcode: true }
  };
}

(async () => {
  // Simulate offline: store events locally
  const offlineEvents = Array.from({ length: NUM_EVENTS }, (_, i) => makeEvent(i));
  console.log('Events stored offline:', offlineEvents.map(e => e.id));

  // Simulate coming online: login and sync
  const res = await axios.post(`${API_URL}/login`, { username: 'farmer', password: 'farmerpw' });
  const token = res.data.token;
  for (const event of offlineEvents) {
    await axios.post(`${API_URL}/collection-event`, event, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Synced event:', event.id);
  }
})();
