import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false });

export default function Scan() {
  const router = useRouter();

  const handleScan = data => {
    if (data) {
      // Assume QR code contains batchId
      router.push(`/provenance/${data}`);
    }
  };

  const handleError = err => {
    // Optionally show error
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Scan Batch QR Code</h1>
      <div className="w-80 h-80 bg-white rounded shadow flex items-center justify-center">
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </div>
    </main>
  );
}
