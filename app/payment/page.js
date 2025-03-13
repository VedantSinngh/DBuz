"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, Bell, CheckCircle, MapPin, Menu, ShoppingCart } from 'lucide-react';

const PaymentApp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentScreen, setCurrentScreen] = useState('payment'); // 'payment' or 'success'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [fare, setFare] = useState(null); // Fare amount from URL or props

  // Extract fare and trip details from URL
  const busId = searchParams.get('busId');
  const seat = searchParams.get('seat');
  const boarding = searchParams.get('boarding');
  const drop = searchParams.get('drop');
  const fareAmount = searchParams.get('fare'); // e.g., "1500"

  // Authentication check
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        setFare(fareAmount ? parseInt(fareAmount) : 1500); // Default to 1500 if not provided
        fetchQrCode(user.id);
      }
      setLoading(false);
    };
    checkUser();
  }, [router, fareAmount]);

  // Fetch Razorpay QR code from backend
  const fetchQrCode = async (userId) => {
    try {
      const response = await fetch('http://localhost:4000/create-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: fareAmount || 1500, // Use fare from URL or default
          busId: busId || '1',
          seat: seat || 'A1',
          boarding: boarding || 'Koyambedu Bus Terminus',
          drop: drop || 'Gandhipuram Bus Stand',
          userId // Optional: Link to Supabase user
        }),
      });
      const data = await response.json();
      if (data.imageUrl) {
        setQrCodeUrl(data.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  const handlePayNow = () => {
    // Simulate payment confirmation (in reality, use Razorpay webhook to confirm)
    setCurrentScreen('success');
  };

  const handleBackToHome = () => {
    router.push('/home');
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {currentScreen === 'payment' ? (
        <PaymentScreen
          user={user}
          fare={fare}
          qrCodeUrl={qrCodeUrl}
          busId={busId}
          seat={seat}
          boarding={boarding}
          drop={drop}
          onPayNow={handlePayNow}
        />
      ) : (
        <PaymentSuccessScreen onBackToHome={handleBackToHome} />
      )}
    </div>
  );
};

const PaymentScreen = ({ user, fare, qrCodeUrl, busId, seat, boarding, drop, onPayNow }) => {
  return (
    <>
      {/* Header */}
      <div className="bg-gray-200 p-4 flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-700">Payment Screen</h1>
      </div>
      
      {/* User Info */}
      <div className="bg-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center overflow-hidden">
            <img src="/api/placeholder/40/40" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="ml-3">
            <p className="text-sm">Hello {user?.user_metadata?.name || 'User'}!</p>
            <p className="text-xs text-gray-500">Scan to pay with Google Pay</p>
          </div>
        </div>
        <div className="flex">
          <button className="p-2 rounded-full bg-gray-100 mr-2">
            <ChevronLeft size={20} />
          </button>
          <button className="p-2 rounded-full bg-gray-100">
            <Bell size={20} />
          </button>
        </div>
      </div>
      
      {/* Trip Card */}
      <div className="mx-4 mt-2 rounded-lg overflow-hidden shadow-md">
        <div className="bg-red-600 p-4 text-white flex justify-between items-center">
          <div>
            <p className="font-medium">Bus {busId || 'Perera Travels'}</p>
            <p className="text-xs">Seat: {seat || 'A1'}</p>
            <p className="text-xs mt-2">{boarding || 'Koyambedu'} — {drop || 'Gandhipuram'}</p>
          </div>
          <div className="ml-4">
            <p className="text-sm">Fare: ₹{fare || 1500}</p>
          </div>
        </div>
      </div>
      
      {/* QR Code Display */}
      <div className="mx-4 mt-6 bg-white rounded-lg p-4 shadow-sm flex flex-col items-center">
        <h2 className="text-center font-medium mb-4">Scan with Google Pay</h2>
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="Google Pay QR Code" className="w-48 h-48" />
        ) : (
          <p>Loading QR code...</p>
        )}
        <p className="text-sm text-gray-600 mt-2">Amount: ₹{fare || 1500}</p>
      </div>
      
      {/* Pay Now Button (Simulated Confirmation) */}
      <div className="mx-4 mt-6">
        <button 
          className="w-full bg-red-500 text-white py-3 rounded-lg font-medium"
          onClick={onPayNow}
        >
          Confirm Payment
        </button>
      </div>
      
      {/* Spacer */}
      <div className="flex-1"></div>
      
      {/* Bottom Navigation */}
      <div className="bg-white p-4 border-t flex justify-around">
        <button className="p-2">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <MapPin size={16} className="text-white" />
          </div>
        </button>
        <button className="p-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center relative">
            <Menu size={16} className="text-gray-500" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </button>
        <button className="p-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <Bell size={16} className="text-gray-500" />
          </div>
        </button>
        <button className="p-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <Menu size={16} className="text-gray-500" />
          </div>
        </button>
      </div>
    </>
  );
};

const PaymentSuccessScreen = ({ onBackToHome }) => {
  return (
    <div className="flex flex-col h-screen bg-pink-50">
      {/* Header */}
      <div className="bg-gray-200 p-4 flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-700">Payment Success</h1>
      </div>
      
      {/* Success Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative mb-8">
          <div className="w-32 h-64 bg-white rounded-xl border-2 border-purple-200 shadow-md relative">
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
              <ShoppingCart size={32} className="text-purple-400" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
            <CheckCircle size={24} className="text-white" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" strokeWidth="2" fill="none">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"></path>
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
          </div>
          <div className="absolute -top-2 -left-2 text-yellow-400">★</div>
          <div className="absolute -top-1 -right-3 text-yellow-400">★</div>
          <div className="absolute bottom-6 -right-4 text-yellow-400">★</div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Successful</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Thank you for booking with us. Your ticket details will be sent to your email.
        </p>
        
        <button 
          className="bg-red-600 text-white py-3 px-8 rounded-md font-medium"
          onClick={onBackToHome}
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default PaymentApp;