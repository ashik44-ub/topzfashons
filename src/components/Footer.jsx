import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate ইম্পোর্ট করুন
import { useSelector } from 'react-redux'; // useSelector ইম্পোর্ট করুন
import logo from '../assets/logo.png';
import toast from 'react-hot-toast'; // মেসেজ দেখানোর জন্য
import Newletter from './newletter/Newletter';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // ১. কার্ট থেকে প্রোডাক্ট সংখ্যা চেক করা
  const products = useSelector((state) => state.cart.products);

  // ২. চেকআউট হ্যান্ডলার লজিক
  const handleCheckoutClick = (e) => {
    e.preventDefault(); // লিঙ্কের ডিফল্ট বিহেভিয়ার বন্ধ করা
    
    if (products.length > 0) {
      navigate('/checkout');
    } else {
      toast.error("Your cart is empty! Please add products first.");
      navigate('/shop');
    }
  };

  return (
    <footer className="bg-white pb-2 border-gray-100 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* About Section */}
          <div className="space-y-6">
            <Link to="/">
              <img src={logo} alt="Ashion Logo" className="h-20" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              TopZ Fashions is a fashion-forward clothing brand that is committed to providing high-quality clothing at affordable prices for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="text-gray-900 font-bold uppercase tracking-widest text-sm mb-6">Quick links</h6>
            <ul className="space-y-3 text-sm text-gray-500 font-medium">
              <li><Link to="/about-us" className="hover:text-red-500 transition-colors">About</Link></li>
              <li><Link to="/contact-us" className="hover:text-red-500 transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-red-500 transition-colors">Faq</Link></li>
              <li><Link to="/whoweare" className="hover:text-red-500 transition-colors">Who We Are</Link></li>
            </ul>
          </div>

          {/* Account Section */}
          <div>
            <h6 className="text-gray-900 font-bold uppercase tracking-widest text-sm mb-6">Account</h6>
            <ul className="space-y-3 text-sm text-gray-500 font-medium">
              <li><Link to="/dashboard" className="hover:text-red-500 transition-colors">My Account</Link></li>
              <li><Link to="/dashboard/orders" className="hover:text-red-500 transition-colors">Orders Tracking</Link></li>
              
              {/* ৩. চেকআউট লিঙ্ক ফিক্স */}
              <li>
                <button 
                  onClick={handleCheckoutClick} 
                  className="hover:text-red-500 transition-colors text-left"
                >
                  Checkout
                </button>
              </li>
              
              <li><Link to="/wishlist" className="hover:text-red-500 transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
         <Newletter/>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 mt-10">
          <p className="text-xs text-center text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
            Copyright © {currentYear} TopZ Fashions outfitters all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;