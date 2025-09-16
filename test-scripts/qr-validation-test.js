const axios = require('axios');
const QRCode = require('qrcode');

const API_URL = 'http://localhost:3000';
const BATCH_ID = 'BATCHASHWA1';

(async () => {
  // Generate QR code for batch ID
  const qr = await QRCode.toDataURL(BATCH_ID);
  console.log('QR code (data URL):', qr);

  // Simulate scanning QR and looking up provenance
  const res = await axios.get(`${API_URL}/event/${BATCH_ID}`);
  console.log('Provenance for batch:', res.data);
})();
