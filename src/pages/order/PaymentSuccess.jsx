import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { clearCart } from '../../redux/features/cart/CartSlice';
import { useEffect } from 'react';

const PaymentSuccess = () => {
  // URL থেকে tranId রিসিভ করা
  const { tranId } = useParams();

  const dispatch = useDispatch();

    useEffect(() => {
        // User jokhon success page-e ashbe, tokhon cart khali hobe
        dispatch(clearCart());
    }, [dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {/* সাকসেস আইকন */}
        <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        {/* টেক্সট মেসেজ */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successfull!</h2>
        <p className="text-gray-600 mb-6">
          Your order has been received successfully. Thank you for shopping with us!
        </p>

        {/* ট্রানজেকশন আইডি বক্স */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-8">
          <span className="text-sm text-gray-500 block uppercase tracking-wider mb-1">
            Transaction ID
          </span>
          <span className="text-lg font-mono font-semibold text-blue-600 break-all">
            {tranId || "N/A"}
          </span>
        </div>

        {/* বাটনসমূহ */}
        <div className="space-y-3">
          <Link
            to="/dashboard/orders"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            See Your Order
          </Link>
          <Link
            to="/shop"
            className="block w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-md transition duration-300"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;