import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/login', { username, password });
      localStorage.setItem('jwt', res.data.token);
      // Decode JWT to get role
      const payload = JSON.parse(atob(res.data.token.split('.')[1]));
      router.push(`/dashboard/${payload.role}`);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Stakeholder Login</h2>
        <input
          className="w-full border p-2 mb-4"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="w-full border p-2 mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">Login</button>
      </form>
    </main>
  );
}
