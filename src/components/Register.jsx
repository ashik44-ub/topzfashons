import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { useRegisterUserMutation } from '../redux/features/auth/authApi';
import { BeatLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // RTK Query
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  // পাসওয়ার্ড ম্যাচিং চেক করার জন্য watch ব্যবহার করা হয়েছে
  const password = watch("password");

  const onSubmit = async (data) => {
    // ১. পাসওয়ার্ড কনফার্মেশন চেক
    if (data.password !== data.confirmPassword) {
      return setMessage("Passwords do not match!");
    }

    try {
      // ব্যাকএন্ডে ডাটা পাঠানো
      const response = await registerUser(data).unwrap();
      
      toast.success(response.message || "OTP sent to your email!");
      
      // ২. রেজিস্ট্রেশন সফল হলে OTP ভেরিফিকেশন পেজে পাঠানো
      // আমরা ইমেইলটি state হিসেবে পাঠাচ্ছি যাতে ভেরিফিকেশন পেজে ইমেইলটি অটো পাওয়া যায়
      navigate("/verify-otp", { state: { email: data.email } });
      
    } catch (error) {
      // ব্যাকএন্ড থেকে আসা এরর মেসেজ দেখানো
      setMessage(error.data?.message || "Registration Failed! Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl rounded-xl border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tighter">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Join the Topz Fashions
            
            
            
             shop community today
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-700 ml-1">
                Username
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <i className="ri-user-line"></i>
                </span>
                <input
                  {...register("username", { required: "Username is required" })}
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm transition-all"
                  placeholder="John Doe"
                />
                {errors.username && <p className='text-red-500 text-xs mt-1'>{errors.username.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <i className="ri-mail-line"></i>
                </span>
                <input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                  })}
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm transition-all"
                  placeholder="name@example.com"
                />
                {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-700 ml-1">
                Password
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <i className="ri-lock-line"></i>
                </span>
                <input
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" }
                  })}
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm transition-all"
                  placeholder="••••••••"
                />
                {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-700 ml-1">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <i className="ri-shield-check-line"></i>
                </span>
                <input
                  {...register('confirmPassword', { 
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match"
                  })}
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm transition-all"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="terms" type="checkbox" required className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
            </div>
            <div className="ml-3 text-xs">
              <label htmlFor="terms" className="font-medium text-gray-700">
                I agree to the <Link to={'/terms-conditions'} className="text-red-500 hover:underline font-bold">Terms & Conditions</Link>
              </label>
            </div>
          </div>

          {message && <p className='text-red-500 font-semibold text-xs bg-red-50 p-2 rounded'>{message}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-xs font-bold uppercase tracking-[2px] rounded-lg text-white bg-gray-900 hover:bg-black focus:outline-none transition-all duration-300 shadow-lg active:scale-95 disabled:bg-gray-400">
              {isLoading ? <BeatLoader size={8} color="#ffffff" /> : "Register"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-red-500 hover:underline tracking-tight">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;