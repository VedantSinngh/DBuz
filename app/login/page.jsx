'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 px-4 py-8">
      <h1 className="text-xl font-bold text-center text-navy-700 mb-2">Login</h1>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-3 border rounded-md"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-3 border rounded-md"
          required
        />
        <button type="submit" className="bg-red-600 text-white py-3 rounded-md">Login</button>
      </form>
      <p className="text-center mt-4">
        Don’t have an account? <Link href="/register" className="text-red-600">Sign Up</Link>
      </p>
    </div>
  );
}