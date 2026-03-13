import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../../redux/features/auth/authApi';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';

const ForgetPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill("")); 
    const [finalOtp, setFinalOtp] = useState(""); 
    
    const navigate = useNavigate();
    
    // watch যুক্ত করা হয়েছে যাতে কনফার্ম পাসওয়ার্ড চেক করা যায়
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

    // Step 1: Send OTP
    const handleSendEmail = async (data) => {
        try {
            await forgotPassword({ email: data.email }).unwrap();
            setEmail(data.email);
            setStep(2);
            toast.success("OTP sent to your email!");
        } catch (err) {
            toast.error(err.data?.message || "User not found!");
        }
    };

    // OTP Input Change Logic
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;
        const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
        setOtp(newOtp);

        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        const combinedOtp = otp.join("");
        if (combinedOtp.length === 6) {
            setFinalOtp(combinedOtp);
            setStep(3);
        } else {
            toast.error("Please enter 6-digit OTP");
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (data) => {
        try {
            await resetPassword({ 
                email, 
                otp: finalOtp, 
                newPassword: data.newPassword 
            }).unwrap();
            
            toast.success("Password reset successful!");
            navigate('/login');
        } catch (err) {
            toast.error(err.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl rounded-xl border border-gray-100">
                
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <i className={`${step === 1 ? 'ri-lock-password-line' : step === 2 ? 'ri-mail-send-line' : 'ri-shield-keyhole-line'} text-red-600 text-2xl`}></i>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tighter">
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Verify OTP"}
                        {step === 3 && "New Password"}
                    </h2>
                </div>

                {/* Step 1: Email */}
                {step === 1 && (
                    <form onSubmit={handleSubmit(handleSendEmail)} className="mt-8 space-y-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-700 ml-1">Email Address</label>
                            <input
                                {...register("email", { required: "Email is required" })}
                                type="email"
                                className="block w-full px-3 py-3 mt-1 border border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500 outline-none text-sm transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                        <button type="submit" disabled={isSendingOtp} className="w-full flex justify-center py-3.5 px-4 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-all shadow-lg active:scale-95 disabled:bg-gray-400">
                            {isSendingOtp ? <BeatLoader size={8} color="#fff" /> : "Send Code"}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="mt-8 space-y-6">
                        <div className="flex justify-center gap-2">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    className="w-11 h-13 border-2 rounded-lg text-center text-xl font-bold border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                                    value={data}
                                    onChange={(e) => handleOtpChange(e.target, index)}
                                    onFocus={(e) => e.target.select()}
                                />
                            ))}
                        </div>
                        <button type="submit" className="w-full flex justify-center py-3.5 px-4 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-all shadow-lg">
                            Verify & Continue
                        </button>
                        <p className="text-center text-xs text-gray-400 uppercase font-bold cursor-pointer hover:text-red-500 transition-all mt-4" onClick={() => setStep(1)}>
                            Back to Email
                        </p>
                    </form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <form onSubmit={handleSubmit(handleResetPassword)} className="mt-8 space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-700 ml-1">Create New Password</label>
                            <input
                                {...register("newPassword", { 
                                    required: "Password is required", 
                                    minLength: { value: 6, message: "Minimum 6 characters" } 
                                })}
                                type="password"
                                className={`block w-full px-3 py-3 mt-1 border ${errors.newPassword ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-red-500 focus:border-red-500 outline-none text-sm`}
                                placeholder="••••••••"
                            />
                            {errors.newPassword && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.newPassword.message}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-700 ml-1">Confirm New Password</label>
                            <input
                                {...register("confirmPassword", { 
                                    required: "Please confirm your password",
                                    validate: (value) => value === watch('newPassword') || "Passwords do not match" 
                                })}
                                type="password"
                                className={`block w-full px-3 py-3 mt-1 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-red-500 focus:border-red-500 outline-none text-sm`}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.confirmPassword.message}</p>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isResetting} 
                            className="w-full flex justify-center py-3.5 px-4 bg-red-600 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
                        >
                            {isResetting ? <BeatLoader size={8} color="#fff" /> : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;