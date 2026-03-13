import React, { useState, useEffect } from 'react'; // useEffect যোগ করা হয়েছে
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/auth/authSlice';
import { BeatLoader } from 'react-spinners';
import toast from 'react-hot-toast'; // টোস্ট ইম্পোর্ট করা হয়েছে

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // setValue অ্যাড করা হয়েছে যাতে ডাটা অটো-ফিল করা যায়
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  // ১. পেজ লোড হওয়ার সময় আগের ইমেইল চেক করা
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setValue("email", savedEmail); // React Hook Form এ ইমেইল সেট করা
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setMessage(''); 
      const response = await loginUser(data).unwrap();
      const { user } = response;

      // ২. Remember Me চেক করে ডাটা সেভ বা রিমুভ করা
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      dispatch(setUser({ user }));
      toast.success("Login successful!");
      navigate('/');
    } catch (error) {
      setMessage(error.data?.message || "Invalid email or password.");
      toast.error(error.data?.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl rounded-xl">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tighter">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Please enter your details to login
          </p>
        </div>

        {message && (
          <div className="mt-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase tracking-widest flex items-center animate-pulse">
            <i className="ri-error-warning-line mr-2 text-lg"></i>
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
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
                {errors.email && <p className='text-red-500 text-[10px] mt-1 font-bold uppercase ml-1'>{errors.email.message}</p>}
              </div>
            </div>

            {/* Password Field */}
            <div>
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
                {errors.password && <p className='text-red-500 text-[10px] mt-1 font-bold uppercase ml-1'>{errors.password.message}</p>}
              </div>
            </div>
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
              <Link to={'/forget-password'} className="text-red-500 hover:text-red-600">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-lg text-white bg-gray-900 hover:bg-black focus:outline-none transition-all duration-300 shadow-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? <BeatLoader size={8} color="#ffffff" /> : "Login"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-red-500 hover:underline">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;