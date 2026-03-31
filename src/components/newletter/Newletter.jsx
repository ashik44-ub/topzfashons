import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getBaseUrl } from '../../utils/getBaseUrl';
import { motion, AnimatePresence } from 'framer-motion';

const Newletter = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${getBaseUrl()}/api/newsletter/news-letter`, { email });
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
            <motion.h6 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-gray-900 font-bold uppercase tracking-widest text-sm"
            >
                Newsletter
            </motion.h6>

            <form onSubmit={handleSubmit} className="relative group">
                <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 h-[2px] bg-red-500 z-10 origin-left"
                    style={{ scaleX: email ? 1 : 0, transition: 'transform 0.3s' }}
                />
                
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border-b-2 border-gray-100 py-3 pr-28 focus:border-transparent outline-none transition-colors text-sm bg-transparent relative z-0"
                />

                <motion.button
                    disabled={loading}
                    type="submit"
                    whileHover={!loading ? { scale: 1.05, backgroundColor: "#f87171" } : {}}
                    whileTap={!loading ? { scale: 0.95 } : {}}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 font-extrabold uppercase tracking-widest text-[10px] transition-all duration-300 px-5 py-2.5 rounded-full shadow-lg
                        ${loading
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-red-500 text-white shadow-red-500/20'
                        }`}
                >
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.span
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Wait...
                            </motion.span>
                        ) : (
                            <motion.span
                                key="submit"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Subscribe
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </form>

            {/* Social Media with Staggered Animation */}
            <div className="flex space-x-5 text-gray-900">
                {[
                    { icon: 'ri-facebook-fill', link: '#' },
                    { icon: 'ri-twitter-x-fill', link: '#' },
                    { icon: 'ri-youtube-line', link: '#' },
                    { icon: 'ri-instagram-line', link: '#' },
                    { icon: 'ri-pinterest-line', link: '#' }
                ].map((social, index) => (
                    <motion.a
                        key={index}
                        href={social.link}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, color: '#ef4444' }}
                        className="transition-colors text-xl"
                    >
                        <i className={social.icon}></i>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}

export default Newletter;