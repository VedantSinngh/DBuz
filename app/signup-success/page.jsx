import Link from 'next/link';

export default function SignupSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50">
      <h1 className="text-2xl font-bold text-navy-700 mb-4">Sign Up Successful!</h1>
      <Link href="/login">
        <button className="bg-red-600 text-white py-3 px-6 rounded-md">Go to Login</button>
      </Link>
    </div>
  );
}