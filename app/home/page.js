'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [journeys, setJourneys] = useState([]);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [popularRoutes, setPopularRoutes] = useState([]);

  const routeDistances = [
    { from: 'Chennai', to: 'Coimbatore', distance: '500 km', travelTime: '8-9 hours' },
    { from: 'Chennai', to: 'Madurai', distance: '450 km', travelTime: '7-8 hours' },
    { from: 'Chennai', to: 'Pondicherry', distance: '170 km', travelTime: '3-4 hours' },
    { from: 'Coimbatore', to: 'Chennai', distance: '500 km', travelTime: '8-9 hours' },
    { from: 'Madurai', to: 'Chennai', distance: '450 km', travelTime: '7-8 hours' },
    { from: 'Chennai', to: 'Bangalore', distance: '350 km', travelTime: '6-7 hours' },
  ];

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) {
          router.push('/login');
          return;
        }
        setUserName(user.user_metadata?.name || 'User');
        setPopularRoutes(routeDistances);
        // Mock journey data
        setJourneys([
          { id: 1, from_location: 'Chennai', to_location: 'Coimbatore', departure_date: '2025-03-15', departure_time: '18:00' },
          { id: 2, from_location: 'Madurai', to_location: 'Chennai', departure_date: '2025-03-16', departure_time: '20:00' },
        ]);
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Authentication failed. Please log in again.');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchParams.from || !searchParams.to) {
      setError('Please enter both origin and destination');
      return;
    }
    router.push(`/booking?from=${encodeURIComponent(searchParams.from)}&to=${encodeURIComponent(searchParams.to)}&date=${encodeURIComponent(searchParams.date)}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const selectRoute = (from, to) => {
    setSearchParams({ ...searchParams, from, to });
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <header className="sticky top-0 bg-white shadow-sm p-4 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-red-600">Travel App</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm mr-2">Hi, {userName}!</p>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded-full"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow p-4 max-w-md mx-auto w-full">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-medium mb-3">Find a Journey</h2>
          <form onSubmit={handleSearch} className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">From</label>
              <input
                type="text"
                name="from"
                value={searchParams.from}
                onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                placeholder="Origin city"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">To</label>
              <input
                type="text"
                name="to"
                value={searchParams.to}
                onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                placeholder="Destination city"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Search Journeys
            </button>
          </form>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-medium mb-3">Popular Routes</h2>
          <div className="grid grid-cols-1 gap-2">
            {popularRoutes.map((route, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-3 hover:bg-pink-50 transition-colors cursor-pointer"
                onClick={() => selectRoute(route.from, route.to)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{route.from} → {route.to}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-600 mr-3">
                        <span className="font-semibold">Distance:</span> {route.distance}
                      </span>
                      <span className="text-xs text-gray-600">
                        <span className="font-semibold">Travel time:</span> {route.travelTime}
                      </span>
                    </div>
                  </div>
                  <button
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectRoute(route.from, route.to);
                      document.forms[0].dispatchEvent(new Event('submit', { cancelable: true }));
                    }}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Upcoming Journeys</h2>
            <button
              onClick={() => setJourneys([...journeys])}
              className="text-xs text-red-600"
            >
              Refresh
            </button>
          </div>
          {isLoading ? (
            <div className="py-4 text-center text-gray-500">Loading journeys...</div>
          ) : error ? (
            <div className="py-4 text-center text-red-600 text-sm">{error}</div>
          ) : journeys.length === 0 ? (
            <div className="py-4 text-center text-gray-500">No upcoming journeys found</div>
          ) : (
            <div className="space-y-2">
              {journeys.map((journey) => (
                <div
                  key={journey.id}
                  className="border border-gray-100 rounded-md p-3 hover:bg-pink-50 transition-colors"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{journey.from_location} → {journey.to_location}</p>
                      <p className="text-xs text-gray-600">{journey.departure_date} at {journey.departure_time}</p>
                      {popularRoutes.find(
                        (r) => r.from === journey.from_location && r.to === journey.to_location
                      ) && (
                        <p className="text-xs text-gray-600 mt-1">
                          Distance:{' '}
                          {
                            popularRoutes.find(
                              (r) => r.from === journey.from_location && r.to === journey.to_location
                            ).distance
                          }
                        </p>
                      )}
                    </div>
                    <Link href={`/journey/${journey.id}`} className="text-xs text-red-600 self-center">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="sticky bottom-0 bg-white border-t shadow-md">
        <nav className="flex justify-around items-center h-14">
          <Link href="/home" className="flex flex-col items-center w-1/3 pt-1 text-red-600">
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link href="/booking" className="flex flex-col items-center w-1/3 pt-1 text-gray-600">
            <span className="text-xs font-medium">My Bookings</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center w-1/3 pt-1 text-gray-600">
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}