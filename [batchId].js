import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Provenance() {
  const router = useRouter();
  const { batchId } = router.query;
  const [provenance, setProvenance] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (batchId) {
      axios.get(`http://localhost:3000/event/${batchId}`)
        .then(res => setProvenance(res.data))
        .catch(() => setError('Batch not found'));
    }
  }, [batchId]);

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!provenance) return <div className="p-8">Loading...</div>;

  // For demo, just show JSON. In production, render map, timeline, certificates, badges.
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Provenance for Batch {batchId}</h1>
      <div className="w-full max-w-2xl bg-white rounded shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Provenance Data</h2>
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(provenance, null, 2)}</pre>
      </div>
      {/* TODO: Render map, timeline, lab certificates, sustainability badges */}
    </main>
  );
}
