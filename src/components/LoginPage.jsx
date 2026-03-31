import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/auth/authSlice';
import { BeatLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setMessage(''); 
      const response = await loginUser(data).unwrap();
      const { user, token } = response;

      if (token) {
        localStorage.setItem('token', token);
      }

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      dispatch(setUser({ user }));
      toast.success("Login successful!");
      navigate('/');
    } catch (error) {
      const errorMsg = error.data?.message || "Invalid email or password.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl rounded-xl"
      >
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-gray-900 uppercase tracking-tighter"
          >
            Welcome Back
          </motion.h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Please enter your details to login
          </p>
        </div>

        {/* Error Message Animation */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase tracking-widest flex items-center overflow-hidden"
            >
              <i className="ri-error-warning-line mr-2 text-lg"></i>
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Field */}
            <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <i className="ri-mail-line"></i>
                </span>
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-red-500 focus:border-red-500 outline-none text-sm transition-all`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-red-500 text-[10px] mt-1 font-bold uppercase ml-1'>
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-700 ml-1">
                Password
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <i className="ri-lock-line"></i>
                </span>
                <input
                  {...register("password", { required: "Password is required" })}
                  type="password"
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-red-500 focus:border-red-500 outline-none text-sm transition-all`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-red-500 text-[10px] mt-1 font-bold uppercase ml-1'>
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer" 
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>
            <div className="text-xs font-bold uppercase tracking-tighter">
              <Link to={'/forget-password'} className="text-red-500 hover:text-red-600 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              disabled={isLoading}
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-lg text-white bg-gray-900 hover:bg-black focus:outline-none transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? <BeatLoader size={8} color="#ffffff" /> : "Login"}
            </button>
          </motion.div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-red-500 hover:underline">
            Register Now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;