import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getBaseUrl } from '../../utils/getBaseUrl';

const Newletter = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // Newletter.jsx এর handleSubmit ফাংশনের ভেতরে পরিবর্তন করুন
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // ভুল ছিল: /api/newsletter/newletter
            // সঠিক হবে: /api/newsletter/news-letter 
            const response = await axios.post(`${getBaseUrl()   }/api/newsletter/news-letter`, { email });

            toast.success(response.data.message);
            setEmail("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h6 className="text-gray-900 font-bold uppercase tracking-widest text-sm">Newsletter</h6>

            <form onSubmit={handleSubmit} className="relative group">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border-b-2 border-gray-100 py-3 pr-24 focus:border-red-500 outline-none transition-colors text-sm bg-transparent"
                />
                <button
                    disabled={loading}
                    type="submit"
                    className={`absolute right-0 top-1/2 -translate-y-1/2 font-extrabold uppercase tracking-widest text-[11px] transition-all duration-300 px-4 py-2 rounded-sm
    ${loading
                            ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                            : 'bg-red-500 hover:bg-red-400 text-white active:scale-95 shadow-md shadow-red-500/20'
                        }`}
                >
                    {loading ? "Wait..." : "Subscribe"}
                </button>
            </form>

            {/* Social Media */}
            <div className="flex space-x-5 text-gray-900">
                <a href="#" className="hover:text-red-500 transition-all text-xl"><i className="ri-facebook-fill"></i></a>
                <a href="#" className="hover:text-red-500 transition-all text-xl"><i className="ri-twitter-x-fill"></i></a>
                <a href="#" className="hover:text-red-500 transition-all text-xl"><i className="ri-youtube-line"></i></a>
                <a href="#" className="hover:text-red-500 transition-all text-xl"><i className="ri-instagram-line"></i></a>
                <a href="#" className="hover:text-red-500 transition-all text-xl"><i className="ri-pinterest-line"></i></a>
            </div>
        </div>
    );
}

export default Newletter;