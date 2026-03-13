import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyOTPMutation, useResendOTPMutation } from '../redux/features/auth/authApi'; // useResendOTPMutation যোগ করুন
import { BeatLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const Otp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60); // ৬০ সেকেন্ডের টাইমার

  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation(); // রিসেন্ড API

  // টাইমার লজিক
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  // রিসেন্ড হ্যান্ডলার
  const handleResend = async () => {
    try {
      await resendOTP({ email }).unwrap();
      toast.success("New OTP sent to your email!");
      setTimer(60); // টাইমার রিসেট
      setOtp(['', '', '', '', '', '']); // ইনপুট ক্লিয়ার
      setError('');
    } catch (err) {
      toast.error(err.data?.message || "Failed to resend OTP");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join('');
    if (finalOtp.length < 6) return setError("Please enter all 6 digits");

    try {
      await verifyOTP({ email, otp: finalOtp }).unwrap();
      toast.success("Verification Successful!");
      navigate('/login');
    } catch (err) {
      setError(err.data?.message || "Invalid or Expired OTP!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl rounded-xl border border-gray-100 text-center">
        
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <i className="ri-mail-send-line text-red-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tighter">Verify Email</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Code sent to <span className="text-gray-900 font-bold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-14 border-2 rounded-lg text-center text-xl font-bold border-gray-200 focus:border-red-500 outline-none transition-all"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-xs font-semibold bg-red-50 p-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-[2px] rounded-lg hover:bg-black transition-all disabled:bg-gray-400"
          >
            {isLoading ? <BeatLoader size={8} color="#ffffff" /> : "Verify Account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          Didn't receive the code?{' '}
          {timer > 0 ? (
            <span className="text-gray-900 font-bold ml-1">Wait {timer}s</span>
          ) : (
            <button 
              onClick={handleResend}
              disabled={isResending}
              className="text-red-500 font-bold hover:underline disabled:text-gray-400"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default Otp;