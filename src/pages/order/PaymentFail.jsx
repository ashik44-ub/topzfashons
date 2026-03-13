import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFail = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
        
        {/* ফেইল আইকন */}
        <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto mb-6">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>

        {/* এরর মেসেজ */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Payment Failed!</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Oops! Something went wrong with your transaction. Don't worry, no money was deducted from your account.
        </p>

        {/* সম্ভাব্য কারণসমূহ (Optional) */}
        <div className="text-left bg-red-50 p-4 rounded-lg mb-8">
          <p className="text-sm text-red-700 font-semibold mb-1">Common reasons:</p>
          <ul className="text-xs text-red-600 list-disc list-inside space-y-1">
            <li>Insufficient balance in your account</li>
            <li>Connection timeout during payment</li>
            <li>Incorrect card or wallet details</li>
          </ul>
        </div>

        {/* বাটনসমূহ */}
        <div className="flex flex-col gap-3">
          <Link
            to="/cart"
            className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition duration-300 shadow-md"
          >
            Try Again
          </Link>
          
          <Link
            to="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition duration-300"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Need help? <Link to="/contact" className="text-blue-500 underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
};

export default PaymentFail;