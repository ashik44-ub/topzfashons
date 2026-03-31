import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png';
import toast from 'react-hot-toast';
import Newletter from './newletter/Newletter';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  const products = useSelector((state) => state.cart.products);

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    if (products.length > 0) {
      navigate('/checkout');
    } else {
      toast.error("Your cart is empty! Please add products first.");
      navigate('/shop');
    }
  };

  // Animation Variants
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={footerVariants}
      className="bg-white pb-6 border-t border-gray-50 mt-20"
    >
      <div className="container mx-auto px-4 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* About Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Link to="/">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                src={logo} 
                alt="Ashion Logo" 
                className="h-16 object-contain" 
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              TopZ Fashions is a fashion-forward clothing brand that is committed to providing high-quality clothing at affordable prices for everyone.
            </p>
            {/* Social Icons (Optional but recommended for footer) */}
            <div className="flex gap-4 text-gray-400">
               <motion.a whileHover={{ y: -3, color: '#ef4444' }} href="#"><i className="ri-facebook-fill text-xl"></i></motion.a>
               <motion.a whileHover={{ y: -3, color: '#ef4444' }} href="#"><i className="ri-instagram-line text-xl"></i></motion.a>
               <motion.a whileHover={{ y: -3, color: '#ef4444' }} href="#"><i className="ri-twitter-fill text-xl"></i></motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h6 className="text-gray-900 font-bold uppercase tracking-widest text-xs mb-7">Quick links</h6>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><Link to="/about-us" className="hover:text-red-500 transition-all hover:pl-2">About</Link></li>
              <li><Link to="/contact-us" className="hover:text-red-500 transition-all hover:pl-2">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-red-500 transition-all hover:pl-2">Faq</Link></li>
              <li><Link to="/whoweare" className="hover:text-red-500 transition-all hover:pl-2">Who We Are</Link></li>
            </ul>
          </motion.div>

          {/* Account Section */}
          <motion.div variants={itemVariants}>
            <h6 className="text-gray-900 font-bold uppercase tracking-widest text-xs mb-7">Account</h6>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><Link to="/dashboard" className="hover:text-red-500 transition-all hover:pl-2">My Account</Link></li>
              <li><Link to="/dashboard/orders" className="hover:text-red-500 transition-all hover:pl-2">Orders Tracking</Link></li>
              <li>
                <button 
                  onClick={handleCheckoutClick} 
                  className="hover:text-red-500 transition-all hover:pl-2 text-left"
                >
                  Checkout
                </button>
              </li>
              <li><Link to="/wishlist" className="hover:text-red-500 transition-all hover:pl-2">Wishlist</Link></li>
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div variants={itemVariants}>
            <Newletter/>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-gray-100 pt-8 mt-10"
        >
          <p className="text-[10px] text-center text-gray-400 font-semibold leading-relaxed uppercase tracking-[2px]">
            Copyright © {currentYear} <span className="text-gray-600">TopZ Fashions</span> outfitters all rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;