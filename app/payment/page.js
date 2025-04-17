"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, Bell, CheckCircle, MapPin, Menu, ShoppingCart } from 'lucide-react';

const PaymentApp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentScreen, setCurrentScreen] = useState('payment');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [fare, setFare] = useState(null);

  const busId = searchParams.get('busId');
  const seat = searchParams.get('seat');
  const boarding = searchParams.get('boarding');
  const drop = searchParams.get('drop');
  const fareAmount = searchParams.get('fare');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        setFare(fareAmount ? parseInt(fareAmount) : 1500);
        fetchQrCode(user.id);
      }
      setLoading(false);
    };
    checkUser();
  }, [router, fareAmount]);

  const fetchQrCode = async (userId) => {
    try {
      const response = await fetch('http://localhost:4000/create-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: fareAmount || 1500,
          busId: busId || '1',
          seat: seat || 'A1',
          boarding: boarding || 'Koyambedu Bus Terminus',
          drop: drop || 'Gandhipuram Bus Stand',
          userId,
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

  const handlePayNow = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    try {
      const res = await fetch('/api/confirm-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          busId,
          seat,
          boarding,
          drop,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setCurrentScreen('success');
      } else {
        alert('Booking failed: ' + result.error);
      }
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Something went wrong during booking.');
    }
  };

  const handleBackToHome = () => {
    router.push('/home');
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="flex flex-col h-screen bg-blue-50">
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
      <div className="bg-blue-600 p-4 shadow-md flex items-center justify-between text-white">
        <h1 className="text-lg font-semibold">Payment</h1>
      </div>

      <div className="bg-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center overflow-hidden">
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

      <div className="mx-4 mt-2 rounded-lg overflow-hidden shadow-md">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
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

      <div className="mx-4 mt-6 bg-white rounded-lg p-4 shadow-sm flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">Scan with Google Pay</h2>
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="Google Pay QR Code" className="w-48 h-48 rounded-md shadow-lg" />
        ) : (
          <p>Loading QR code...</p>
        )}
        <p className="text-sm text-gray-600 mt-2">Amount: ₹{fare || 1500}</p>
      </div>

      <div className="mx-4 mt-6">
        <button 
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
          onClick={onPayNow}
        >
          Confirm Payment
        </button>
      </div>

      <div className="flex-1"></div>

      <div className="bg-white p-4 border-t flex justify-around">
        <button className="p-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
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
    <div className="flex flex-col h-screen bg-blue-50">
      <div className="bg-blue-600 p-4 shadow-md flex items-center justify-between text-white">
        <h1 className="text-lg font-semibold">Payment Success</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative mb-8">
          <div className="w-32 h-64 bg-white rounded-xl border-2 border-indigo-200 shadow-md relative">
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
              <ShoppingCart size={32} className="text-indigo-400" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
            <CheckCircle size={24} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Thank you for booking with us. Your ticket details will be sent to your email.
        </p>

        <button 
          className="bg-blue-600 text-white py-3 px-6 rounded-md font-medium"
          onClick={onBackToHome}
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default PaymentApp;
