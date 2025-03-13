'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function Booking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date') || new Date().toLocaleDateString();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        // Mock data instead of fetching from backend
        setBuses([
          {
            id: 1,
            operator: 'RedBus Express',
            type: 'AC Sleeper',
            departureTime: '18:00',
            arrivalTime: '06:00',
            duration: '12h',
            fare: 1200,
            availableSeats: 5,
            rating: 4.7,
            reviews: 195,
          },
          {
            id: 2,
            operator: 'GreenLine',
            type: 'Non-AC Seater',
            departureTime: '20:00',
            arrivalTime: '08:00',
            duration: '12h',
            fare: 800,
            availableSeats: 10,
            rating: 4.2,
            reviews: 122,
          },
          {
            id: 3,
            operator: 'Royal Travels',
            type: 'AC Semi-Sleeper',
            departureTime: '19:30',
            arrivalTime: '07:15',
            duration: '11h 45m',
            fare: 1050,
            availableSeats: 8,
            rating: 4.5,
            reviews: 165,
          },
        ]);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleBusSelect = (busId) => {
    router.push(`/seat-selection?busId=${busId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Finding the best buses for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold mb-3">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-red-800 to-red-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-3 rounded-full p-2 hover:bg-red-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Available Buses</h1>
          </div>
          <div className="bg-red-900 bg-opacity-30 rounded-xl p-5 mb-1 shadow-md">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white rounded-full mr-3"></div>
                <span className="font-medium text-lg">{from}</span>
              </div>
              <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full h-0.5 bg-white bg-opacity-30 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-lg">{to}</span>
                <div className="w-4 h-4 bg-white rounded-full ml-3"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm opacity-90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline mr-1"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {date}
              </p>
              <Link
                href="/"
                className="text-sm bg-red-600 px-3 py-1 rounded-md hover:bg-red-700 transition-colors"
              >
                Change
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {buses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <div className="bg-red-100 text-red-500 p-4 rounded-full inline-block mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-800 mb-3">No Buses Available</h3>
            <p className="text-gray-600 mb-6">We couldn't find any buses for your selected route.</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Change Route
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-700 font-medium text-lg">
                <span className="text-red-600 font-bold">{buses.length}</span> buses found
              </p>
              <div className="flex space-x-3">
                <button className="text-sm px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                  Price
                </button>
                <button className="text-sm px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filter
                </button>
              </div>
            </div>
            
            {buses.map((bus) => (
              <div key={bus.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M8 6h12M8 12h12M8 18h12M3 6h.01M3 12h.01M3 18h.01" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{bus.operator}</h3>
                        <div className="flex items-center">
                          <svg
                            className="text-yellow-500 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          <span className="text-sm text-gray-600">{bus.rating} ({bus.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1.5 rounded-full">{bus.type}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{bus.departureTime}</p>
                      <p className="text-xs text-gray-500 font-medium">Departure</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-6">
                      <div className="w-full h-0.5 bg-red-200 relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-red-50 px-2 py-1 rounded-full border border-red-200 text-red-600">
                          {bus.duration}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{bus.arrivalTime}</p>
                      <p className="text-xs text-gray-500 font-medium">Arrival</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                        <span className="font-medium text-green-600">{bus.availableSeats}</span> seats available
                      </p><div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                          </svg>
                          WiFi
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          USB
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                          </svg>
                          Water
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">₹{bus.fare}</p>
                      <p className="text-xs text-gray-500 mb-2">Per Person</p>
                      <button
                        onClick={() => handleBusSelect(bus.id)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md flex items-center justify-center"
                      >
                        Select Seats
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 text-xs text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-red-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Estimated arrival time may vary based on traffic conditions</span>
                </div>
              </div>
            ))}
            
            <div className="mt-8 text-center">
              <button className="bg-white border border-red-300 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors shadow-sm">
                Load More Buses
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">© 2025 Bus Booking App</p>
            <div className="flex items-center">
              <Link href="/support" className="text-sm text-red-600 hover:text-red-700 mr-4">
                Help & Support
              </Link>
              <Link href="/about" className="text-sm text-red-600 hover:text-red-700">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}