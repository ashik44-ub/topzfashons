import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import popupimage from '../../assets/rawatpopup.jpg'; 
import { motion, AnimatePresence } from 'framer-motion'; // Framer Motion ইম্পোর্ট করুন

const PopUpBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000); 

            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [location.pathname]);

    const handleShopNow = () => {
        setIsVisible(false);
        navigate('/shop');
    };

    const closePopup = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && location.pathname === '/' && (
                <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center p-4 bg-black/70 backdrop-blur-sm">
                    
                    {/* Overlay Click to Close */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePopup}
                        className="absolute inset-0 cursor-pointer"
                    />

                    {/* PopUp Card Content */}
                    <motion.div 
                        initial={{ y: "100%", opacity: 0, scale: 0.5 }}
                        animate={{ 
                            y: 0, 
                            opacity: 1, 
                            scale: 1,
                            transition: { 
                                type: "spring", 
                                damping: 20, 
                                stiffness: 100,
                                duration: 0.6 
                            } 
                        }}
                        exit={{ 
                            y: "100%", 
                            opacity: 0, 
                            transition: { duration: 0.4, ease: "easeInOut" } 
                        }}
                        className="relative bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl z-50"
                    >
                        {/* Close Button with Hover Animation */}
                        <motion.button 
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={closePopup}
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md z-50"
                        >
                            <i className="ri-close-line text-2xl text-black"></i>
                        </motion.button>

                        <div className="flex flex-col">
                            {/* Image Section */}
                            <div className="overflow-hidden">
                                <motion.img 
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 1.5 }}
                                    src={popupimage} 
                                    alt="Banner" 
                                    className="w-full h-auto max-h-[400px] object-cover" 
                                />
                            </div>

                            {/* Text & Action Section */}
                            <div className="p-8 text-center bg-white">
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl font-black text-gray-900 uppercase"
                                >
                                    Big Winter Sale!
                                </motion.h2>
                                
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-gray-500 mt-2 font-medium"
                                >
                                    Get up to <span className='text-black font-bold'>10% OFF</span> this week.
                                </motion.p>
                                
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={handleShopNow}
                                    className="mt-6 px-12 py-3.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-400"
                                >
                                    Shop Now
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PopUpBanner;