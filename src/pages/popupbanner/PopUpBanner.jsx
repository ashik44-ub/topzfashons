import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation যোগ করুন
import popupimage from '../../assets/rawatpopup.jpg'; 

const PopUpBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // বর্তমান ইউআরএল (URL) ট্র্যাক করার জন্য

    useEffect(() => {
        // চেক করবে ইউজার এখন হোম পেজে ('/') আছে কি না
        if (location.pathname === '/') {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000); 

            return () => clearTimeout(timer);
        } else {
            // যদি হোম পেজ না হয়, তবে পপ-আপ বন্ধ থাকবে
            setIsVisible(false);
        }
    }, [location.pathname]); // প্রতিবার পেজ চেঞ্জ হলে এটি রান করবে

    const handleShopNow = () => {
        setIsVisible(false);
        navigate('/shop');
    };

    const closePopup = () => {
        setIsVisible(false);
    };

    // যদি পপ-আপ দৃশ্যমান না হয় অথবা ইউজার হোম পেজে না থাকে, তবে কিছুই রেন্ডার হবে না
    if (!isVisible || location.pathname !== '/') return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-500">
            {/* ... বাকি কোড আগে যা ছিল সব একই থাকবে ... */}
            <div className="relative bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                 {/* আপনার আগের পপ-আপ ডিজাইন এখানে থাকবে */}
                 <button 
                    onClick={closePopup}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md z-50"
                >
                    <i className="ri-close-line text-2xl text-black"></i>
                </button>
                <div className="flex flex-col">
                    <img src={popupimage} alt="Banner" className="w-full h-auto max-h-[450px] object-cover" />
                    <div className="p-8 text-center bg-white">
                        <h2 className="text-3xl font-black text-gray-900 uppercase">Big Winter Sale!</h2>
                        <p className="text-gray-500 mt-2 font-medium">Get up to <span className='text-black font-bold'>10% OFF</span> this week.</p>
                        <button 
                            onClick={handleShopNow}
                            className="mt-6 px-12 py-3.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-600 transition-all"
                        >
                            Shop Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopUpBanner;