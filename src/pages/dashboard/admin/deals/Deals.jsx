import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimerData } from '../../../../redux/features/timer/timerSlice';
import { getBaseUrl } from '../../../../utils/getBaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const Deals = () => {
    const dispatch = useDispatch();
    const { data: timerData, isLoading } = useSelector((state) => state.timer || {});

    const [formData, setFormData] = useState({
        title: '',
        discountPercentage: '',
        endDate: '',
        image: '', // ইমেজ লিঙ্ক সেভ করার জন্য নতুন ফিল্ড
        isActive: true
    });

    const [previewTime, setPreviewTime] = useState({ days: 0, hours: 0, min: 0, sec: 0 });

    useEffect(() => {
        dispatch(fetchTimerData());
    }, [dispatch]);

    useEffect(() => {
        if (timerData) {
            // টাইমজোন হ্যান্ডলিং
            let localISOTime = '';
            if (timerData.endDate) {
                const dateObj = new Date(timerData.endDate);
                const tzOffset = dateObj.getTimezoneOffset() * 60000;
                localISOTime = new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, 16);
            }

            setFormData({
                title: timerData.title || '',
                discountPercentage: timerData.discountPercentage || '',
                endDate: localISOTime,
                image: timerData.image || '', // ডাটাবেস থেকে ইমেজ লিঙ্ক আনা
                isActive: timerData.isActive ?? true
            });
        }
    }, [timerData]);

    useEffect(() => {
        if (!formData.endDate) return;
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(formData.endDate).getTime();
            const diff = target - now;

            if (diff > 0) {
                setPreviewTime({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    min: Math.floor((diff / (1000 * 60)) % 60),
                    sec: Math.floor((diff / 1000) % 60)
                });
            } else {
                setPreviewTime({ days: 0, hours: 0, min: 0, sec: 0 });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [formData.endDate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${getBaseUrl()}/api/bestdeals/timer/update`, formData);
            if (response.status === 200 || response.status === 201) {
                toast.success("Deal Updated Successfully!");
                dispatch(fetchTimerData());
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update deal");
        }
    };

    const formatNum = (num) => (num < 10 ? `0${num}` : num);

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <i className="ri-flashlight-line text-yellow-500"></i> Flash Sale Management
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Edit Form --- */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-5 h-fit">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Offer Image URL</label>
                                <input 
                                    type="text" name="image" 
                                    value={formData.image} onChange={handleInputChange} 
                                    placeholder="Paste deal image link (e.g. https://image.com/banner.jpg)" 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-black" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Offer Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-black" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Discount (%)</label>
                                <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">End Date</label>
                                <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-black" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-4 h-4 accent-black" id="status" />
                            <label htmlFor="status" className="text-sm font-medium text-gray-700">Active on Homepage</label>
                        </div>

                        <button type="submit" className="w-full py-4 bg-black text-white font-black uppercase rounded-2xl hover:bg-gray-900 transition-all shadow-xl">
                            Update Flash Sale
                        </button>
                    </form>
                </div>

                {/* --- Live Preview Card --- */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 px-3 py-1 bg-red-50 rounded-full">Live Preview</span>
                    
                    <div className="w-full max-w-sm border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-2xl relative">
                        {/* Background Image Preview */}
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                            {formData.image ? (
                                <img src={formData.image} alt="Deal" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-xs italic">No Image Selected</div>
                            )}
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-red-600">
                                {formData.discountPercentage || 0}% OFF
                            </div>
                        </div>

                        <div className="p-6 text-center">
                            <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter leading-tight">
                                {formData.title || "Limited Offer Title"}
                            </h3>
                            
                            <div className="flex justify-center gap-3">
                                {[
                                    { label: 'D', val: previewTime.days },
                                    { label: 'H', val: previewTime.hours },
                                    { label: 'M', val: previewTime.min },
                                    { label: 'S', val: previewTime.sec }
                                ].map((item) => (
                                    <div key={item.label} className="bg-gray-50 border border-gray-100 w-12 py-2 rounded-xl">
                                        <span className="block text-lg font-black text-gray-900 leading-none">
                                            {formatNum(item.val)}
                                        </span>
                                        <span className="text-[8px] uppercase text-gray-400 font-bold">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Deals;