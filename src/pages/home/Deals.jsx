import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimerData } from '../../redux/features/timer/timerSlice'; 
import dealImg from "../../assets/discount.jpg"; // এটি ব্যাকআপ হিসেবে থাকবে
import { Link } from 'react-router-dom';

const Deals = () => {
  const dispatch = useDispatch();
  const { data: timerData, isLoading } = useSelector((state) => state.timer);

  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    dispatch(fetchTimerData()); 
  }, [dispatch]);

  useEffect(() => {
    if (!timerData || !timerData.isActive) return;

    const targetDate = new Date(timerData.endDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerData]);

  const formatNumber = (num) => (num < 10 ? `0${num}` : num);

  if (isLoading) return <div className="py-20 text-center font-bold">Loading Amazing Deals...</div>;
  if (!timerData || !timerData.isActive) return null;

  return (
    <section className="py-16 bg-[#f4f4f4]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center bg-white shadow-sm overflow-hidden rounded-xl">
          
          {/* --- Image Section (পরিবর্তিত অংশ) --- */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px]">
            <img 
              src={timerData.image || dealImg} // যদি ডাটাবেসে ইমেজ থাকে তবে সেটি দেখাবে, নয়তো লোকাল ইমেজ
              alt="Sale Banner" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 p-10 lg:p-20 text-center lg:text-left">
            <div className="mb-8">
              <span className="text-red-500 font-bold uppercase tracking-[4px] text-xs">Limited Offer</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4">
                {timerData.title} 
              </h2>
              <p className="text-lg text-gray-600 font-medium italic">
                <span className="text-red-500 font-bold not-italic">SALE</span> UP TO {timerData.discountPercentage}% OFF!
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="flex space-x-4 md:space-x-6 mb-12 justify-center lg:justify-start">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Sec', value: timeLeft.seconds }
              ].map((item, index, array) => (
                <React.Fragment key={item.label}>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl md:text-5xl font-black text-gray-900 tabular-nums">
                      {formatNumber(item.value)}
                    </span>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">
                      {item.label}
                    </p>
                  </div>
                  {index !== array.length - 1 && (
                    <span className="text-3xl md:text-4xl font-light text-gray-200 pt-1">:</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <Link to={'/shop'} className="inline-block px-8 py-4 bg-gray-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-red-500 transition-all duration-500 rounded-sm">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Deals;