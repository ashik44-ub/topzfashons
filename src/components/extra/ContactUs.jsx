import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

const ContactUs = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      toast.error("Configuration missing!");
      return;
    }

    setLoading(true);

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then(() => {
        toast.success('Message sent successfully! 🚀', {
          position: 'top-right',
        });
        e.target.reset(); // ফর্ম খালি করে দিবে
      }, (error) => {
        console.error('EmailJS Error:', error.text);
        toast.error('Failed to send message.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-white min-h-screen">
      <Toaster /> 

      {/* --- Header Section --- */}
      <div className="py-16 bg-gray-50 border-b">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
            Contact <span className="text-red-400">Us</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto italic font-medium">
            Questions about your order? Need styling advice? We're here to help.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16 justify-center">
          
          {/* --- Sidebar: Store Info --- */}
          <div className="lg:w-1/3 space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-red-400 mb-4 font-sans">Our Studio</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                Dhaka, Bangladesh<br />
                (Mohakhali, Dhaka-1208)
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-red-400 mb-4 font-sans">Customer Care</h3>
              <p className="text-gray-600 font-medium">Email: support@topzfashions.com</p>
              <p className="text-gray-600 font-medium">Phone: +880 1647545814</p>
            </div>
          </div>

          {/* --- Form Section --- */}
          <div className="lg:w-1/2 bg-white p-8 md:p-10 shadow-2xl rounded-2xl border border-gray-50">
            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <h3 className="text-2xl font-serif font-bold mb-8 text-gray-800 border-b pb-4">Drop Us A Line</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Name</label>
                  <input 
                    className="w-full bg-gray-50 border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-red-400 outline-none transition-all" 
                    required 
                    type="text" 
                    name="name" 
                    placeholder="Your Name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Email</label>
                  <input 
                    className="w-full bg-gray-50 border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-red-400 outline-none transition-all" 
                    required 
                    type="email" 
                    name="email" 
                    placeholder="hello@mail.com" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Message</label>
                <textarea 
                  rows="6" 
                  name="message" 
                  required 
                  className="w-full bg-gray-50 border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-red-400 outline-none transition-all" 
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-gray-900 text-white font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-red-400 transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center ${loading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                    Sending...
                  </>
                ) : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;