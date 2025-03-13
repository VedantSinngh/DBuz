'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      router.push('/signup-success');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 px-4 py-8">
      <h1 className="text-xl font-bold text-center text-navy-700 mb-2">Create an Account</h1>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="p-3 border rounded-md"
          required
        />
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
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={() => setAgreeToTerms(!agreeToTerms)}
            className="accent-red-600"
            required
          />
          <span className="text-sm text-gray-600">I agree to the terms</span>
        </label>
        <button type="submit" className="bg-red-600 text-white py-3 rounded-md" disabled={!agreeToTerms}>
          Sign Up
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account? <Link href="/login" className="text-red-600">Login</Link>
      </p>
    </div>
  );
}