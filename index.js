import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [batchId, setBatchId] = useState('');

  const handleLookup = () => {
    if (batchId) router.push(`/provenance/${batchId}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Ayurvedic Herb Provenance Lookup</h1>
      <button
        className="px-6 py-3 bg-green-600 text-white rounded mb-4"
        onClick={() => router.push('/scan')}
      >
        Scan QR Code
      </button>
      <div className="flex items-center space-x-2">
        <input
          className="border p-2 rounded"
          placeholder="Enter Batch ID"
          value={batchId}
          onChange={e => setBatchId(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleLookup}>
          Lookup
        </button>
      </div>
    </main>
  );
}
