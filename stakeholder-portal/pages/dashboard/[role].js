import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const router = useRouter();
  const { role } = router.query;
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt');
      if (!token) {
        router.push('/login');
        return;
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
      // Fetch events (for demo, just fetch all events by IDs 1-5)
      Promise.all([
        'COL123', 'PROC456', 'LAB789', 'BATCH001'
      ].map(id =>
        axios.get(`http://localhost:3000/event/${id}`).then(res => res.data).catch(() => null)
      )).then(results => setEvents(results.filter(e => e)));
    }
  }, [role]);

  if (!user) return null;

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h1>
      <div className="mb-4">Logged in as: <span className="font-mono">{user.username}</span></div>
      <div className="w-full max-w-2xl bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Recent Events</h2>
        {events.length === 0 && <div>No events found.</div>}
        {events.map(e => (
          <div key={e.id || e.batchId} className="border-b py-2">
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(e, null, 2)}</pre>
          </div>
        ))}
      </div>
    </main>
  );
}
