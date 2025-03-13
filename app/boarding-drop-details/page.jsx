'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function BoardingDropDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [dropPoints, setDropPoints] = useState([]);
  const [selectedBoarding, setSelectedBoarding] = useState('');
  const [selectedDrop, setSelectedDrop] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      else {
        // Mock data instead of fetching from backend
        setBoardingPoints([
          { id: 1, name: 'Point A' },
          { id: 2, name: 'Point B' },
        ]);
        setDropPoints([
          { id: 1, name: 'Drop Point X' },
          { id: 2, name: 'Drop Point Y' },
        ]);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleProceed = () => {
    console.log(`Boarding: ${selectedBoarding}, Drop: ${selectedDrop}`);
    router.push('/home');
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <header className="bg-red-600 p-4 text-white">
        <h1 className="text-lg font-medium">Boarding & Drop Details</h1>
      </header>
      <main className="flex-grow p-4">
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Boarding Point</label>
          <select
            value={selectedBoarding}
            onChange={(e) => setSelectedBoarding(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Boarding Point</option>
            {boardingPoints.map((point) => (
              <option key={point.id} value={point.id}>
                {point.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Drop Point</label>
          <select
            value={selectedDrop}
            onChange={(e) => setSelectedDrop(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Drop Point</option>
            {dropPoints.map((point) => (
              <option key={point.id} value={point.id}>
                {point.name}
              </option>
            ))}
          </select>
        </div>
        <p className="mb-4">Selected Seat: {searchParams.get('seat')}</p>
        <button
          onClick={handleProceed}
          className="w-full bg-red-600 text-white py-2 rounded-md"
          disabled={!selectedBoarding || !selectedDrop}
        >
          Proceed
        </button>
      </main>
      <footer className="p-4 bg-white border-t flex justify-around">
        <Link href="/home" className="text-red-600">Home</Link>
        <Link href="/booking" className="text-gray-600">Bookings</Link>
      </footer>
    </div>
  );
}