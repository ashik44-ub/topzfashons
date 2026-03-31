import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { removeFromWishlist } from '../../redux/features/wishlistSlice/wishlistSlice';
import { addToCart } from '../../redux/features/cart/CartSlice';

const Wishlist = () => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state) => state.wishlist.items);

    const handleRemoveFromWishlist = (id) => {
        dispatch(removeFromWishlist(id));
    };

    const handleAddToCart = (product) => {
        const selectedSize = Array.isArray(product.size) ? product.size[0] : product.size || "M";
        const productWithDetails = { ...product, size: selectedSize };
        dispatch(addToCart(productWithDetails));
    };

    // --- Animation Variants (Exact same style as ShopFiltering) ---
    const containerVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0, 
            transition: { staggerChildren: 0.1, duration: 0.5 } 
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container mx-auto px-4"
            >
                {/* Header Section */}
                <motion.div variants={sectionVariants} className="text-center mb-12">
                    <h5 className="text-sm font-black uppercase tracking-[0.2em] mb-4 border-b-2 border-red-500 inline-block pb-1 text-gray-800">
                        My Wishlist
                    </h5>
                    <p className="text-gray-500 mt-2">Keep track of the items you love.</p>
                </motion.div>

                {wishlistItems.length > 0 ? (
                    <motion.div variants={sectionVariants} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-5 gap-4 p-6 bg-gray-50 font-black uppercase tracking-widest text-[11px] text-gray-600 border-b border-gray-100">
                            <div className="col-span-2">Product Details</div>
                            <div className="text-center">Price</div>
                            <div className="text-center">Stock Status</div>
                            <div className="text-right">Action</div>
                        </div>

                        {/* Items List */}
                        <div className="divide-y divide-gray-100">
                            <AnimatePresence mode='popLayout'>
                                {wishlistItems.map((item) => (
                                    <motion.div 
                                        key={item._id || item.id}
                                        variants={sectionVariants}
                                        layout
                                        exit={{ opacity: 0, x: -20 }}
                                        whileHover={{ backgroundColor: "#fef2f2" }} // hover:bg-red-50 style
                                        className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 items-center transition-colors bg-white"
                                    >
                                        {/* Product Info */}
                                        <div className="col-span-2 flex items-center space-x-4">
                                            <motion.img 
                                                whileHover={{ scale: 1.05 }}
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-20 h-24 object-cover rounded-lg shadow-sm border border-gray-100"
                                            />
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-tight hover:text-red-500 transition-colors">
                                                    <Link to={`/shop/${item._id}`}>{item.name}</Link>
                                                </h3>
                                                <button 
                                                    onClick={() => handleRemoveFromWishlist(item._id || item.id)}
                                                    className="text-[11px] font-bold uppercase tracking-tighter text-red-500 mt-2 flex items-center hover:underline"
                                                >
                                                    <i className="ri-delete-bin-line mr-1"></i> Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-center font-black text-gray-800">
                                            Tk. {Number(item.price).toLocaleString('en-IN')}
                                        </div>

                                        {/* Status */}
                                        <div className="text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                item.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}>
                                                {item.quantity > 0 ? "In Stock" : "Out of Stock"}
                                            </span>
                                        </div>

                                        {/* Order Button */}
                                        <div className="text-right">
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleAddToCart(item)}
                                                disabled={item.quantity <= 0}
                                                className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                                                    item.quantity > 0
                                                    ? "bg-gray-900 text-white hover:bg-red-600 shadow-md" 
                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                }`}
                                            >
                                                Order Now
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : (
                    /* Empty State - ShopFiltering Style */
                    <motion.div 
                        variants={sectionVariants}
                        className="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="inline-block p-6 bg-red-50 rounded-full mb-6"
                        >
                            <i className="ri-heart-line text-5xl text-red-500/30"></i>
                        </motion.div>
                        <h2 className="text-xl font-black uppercase tracking-widest text-gray-900">Your wishlist is empty</h2>
                        <p className="text-gray-500 mt-2 mb-8 text-sm">Add some items to start your collection.</p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link 
                                to="/shop" 
                                className="bg-gray-900 text-white px-10 py-4 rounded-lg font-black uppercase tracking-widest text-[11px] hover:bg-red-600 transition-all shadow-lg"
                            >
                                Back to Shop
                            </Link>
                        </motion.div>
                    </motion.div>
                )}

                {/* Optional Promo Banner (Like ShopFiltering) */}
                <motion.div 
                    variants={sectionVariants}
                    whileHover={{ scale: 1.01 }}
                    className="mt-12 bg-gray-900 p-10 text-white rounded-xl relative overflow-hidden group shadow-xl max-w-4xl mx-auto text-center"
                >
                    <div className="relative z-10">
                        <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">Ready to Checkout?</h4>
                        <p className="text-gray-400 text-xs uppercase tracking-[3px] mb-6">Enjoy exclusive member discounts</p>
                        <Link to="/cart" className="text-[11px] font-black uppercase border-b-2 border-red-500 pb-1 hover:text-red-500 transition-colors">
                            View Your Cart
                        </Link>
                    </div>
                    {/* Decorative Circle from ShopFiltering */}
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" 
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Wishlist;