import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Ayurvedic Herb Traceability Stakeholder Portal</h1>
      <div className="space-y-4">
        <Link href="/login" className="text-blue-600 underline">Login</Link>
        <div className="flex space-x-4">
          <Link href="/dashboard/farmer" className="px-4 py-2 bg-green-600 text-white rounded">Farmer Dashboard</Link>
          <Link href="/dashboard/processor" className="px-4 py-2 bg-yellow-600 text-white rounded">Processor Dashboard</Link>
          <Link href="/dashboard/lab" className="px-4 py-2 bg-blue-600 text-white rounded">Lab Dashboard</Link>
          <Link href="/dashboard/manufacturer" className="px-4 py-2 bg-purple-600 text-white rounded">Manufacturer Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
