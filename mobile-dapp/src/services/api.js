import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Change to your API Gateway URL

export async function syncEventToApi(event) {
  const res = await axios.post(`${API_URL}/collection-event`, event);
  return res.data;
}
