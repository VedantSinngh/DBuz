'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function SeatSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
        } else {
          // Mock seat data instead of fetching from backend
          setSeats([
            { seatNumber: 'A1', status: 'available' },
            { seatNumber: 'A2', status: 'booked' },
            { seatNumber: 'B1', status: 'available' },
            { seatNumber: 'B2', status: 'available' },
          ]);
          setLoading(false);
        }
      } catch (error) {
        setError('Authentication error. Please try again.');
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleSeatSelect = (seatId, status) => {
    if (status === 'booked') return;
    setSelectedSeat(seatId);
    router.push(`/boarding-drop-details?busId=${searchParams.get('busId')}&seat=${seatId}`);
  };

  if (loading && seats.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-center text-gray-800">Select Your Seat</h1>
          <p className="text-center text-gray-600 mt-2">Bus ID: {searchParams.get('busId')}</p>
        </div>
        <div className="p-6">
          {seats.length === 0 ? (
            <p className="text-center text-gray-600">No seats available for this bus.</p>
          ) : (
            <div>
              <div className="flex justify-center mb-6">
                <div className="flex items-center mr-4">
                  <div className="w-6 h-6 bg-gray-200 rounded mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center mr-4">
                  <div className="w-6 h-6 bg-red-400 rounded mr-2"></div>
                  <span className="text-sm">Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-400 rounded mr-2"></div>
                  <span className="text-sm">Selected</span>
                </div>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-5 gap-4 max-w-lg mx-auto">
                {seats.map((seat) => (
                  <button
                    key={seat.seatNumber}
                    onClick={() => handleSeatSelect(seat.seatNumber, seat.status)}
                    disabled={seat.status === 'booked' || loading}
                    className={`
                      h-14 w-14 rounded-lg flex items-center justify-center text-center font-medium transition-colors duration-200
                      ${seat.status === 'booked' ? 'bg-red-400 cursor-not-allowed text-white' : ''}
                      ${selectedSeat === seat.seatNumber ? 'bg-green-400 text-white' : ''}
                      ${seat.status !== 'booked' && selectedSeat !== seat.seatNumber ? 'bg-gray-200 hover:bg-gray-300' : ''}
                    `}
                  >
                    {seat.seatNumber}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Home
          </Link>
          <Link href="/bookings" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}