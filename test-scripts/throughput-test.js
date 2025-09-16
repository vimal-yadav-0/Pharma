const axios = require('axios');

const API_URL = 'http://localhost:3000';
const NUM_EVENTS = 50;

async function login() {
  const res = await axios.post(`${API_URL}/login`, { username: 'farmer', password: 'farmerpw' });
  return res.data.token;
}

function makeEvent(i) {
  return {
    id: `COLTHR${i}`,
    gps: { lat: 19.1 + i * 0.01, lng: 73.5 + i * 0.01 },
    timestamp: new Date().toISOString(),
    species: 'Withania somnifera',
    collectorId: 'FARMER1',
    quality: { moisture: 8.5, pesticide: false, dnaBarcode: true }
  };
}

(async () => {
  const token = await login();
  const start = Date.now();
  await Promise.all(
    Array.from({ length: NUM_EVENTS }, (_, i) =>
      axios.post(`${API_URL}/collection-event`, makeEvent(i), {
        headers: { Authorization: `Bearer ${token}` }
      })
    )
  );
  const end = Date.now();
  console.log(`Submitted ${NUM_EVENTS} events in ${end - start} ms (avg ${(end - start) / NUM_EVENTS} ms/event)`);
})();
