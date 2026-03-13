import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../../redux/features/wishlistSlice/wishlistSlice';
import { addToCart } from '../../redux/features/cart/CartSlice';

const Wishlist = () => {
    const dispatch = useDispatch();
    
    // Redux Store থেকে উইশলিস্টের ডাটা নেওয়া
    const wishlistItems = useSelector((state) => state.wishlist.items);

    const handleRemoveFromWishlist = (id) => {
        dispatch(removeFromWishlist(id));
    };

const handleAddToCart = (product) => {
    // 1. Check koro size array kina. Jodi hoy, tobe prothom element-ta nibe.
    // Jodi array na hoy, tobe direct value-tai nibe.
    const selectedSize = Array.isArray(product.size) 
        ? product.size[0] 
        : product.size || "M"; // Jodi size khali thake tobe default "M"

    // 2. Notun object toiri koro jekhane size hobe ekti String (Array noy)
    const productWithDetails = {
        ...product,
        size: selectedSize 
    };

    dispatch(addToCart(productWithDetails));
    
    // Ichche korle cart-e add hoyar por wishlist theke remove korte paro
    // dispatch(removeFromWishlist(product._id)); 
};

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">My Wishlist</h1>
                    <p className="text-gray-500 mt-2">Keep track of the items you love.</p>
                </div>

                {wishlistItems.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Table Header (Hidden on Mobile) */}
                        <div className="hidden md:grid grid-cols-5 gap-4 p-6 bg-gray-100 font-semibold text-gray-700 uppercase text-sm">
                            <div className="col-span-2">Product Details</div>
                            <div className="text-center">Price</div>
                            <div className="text-center">Stock Status</div>
                            <div className="text-right">Action</div>
                        </div>

                        {/* Wishlist Items */}
                        <div className="divide-y divide-gray-100">
                            {wishlistItems.map((item) => (
                                <div key={item._id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 items-center hover:bg-gray-50 transition-colors">
                                    
                                    {/* Product Info */}
                                    <div className="col-span-2 flex items-center space-x-4">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-20 h-24 object-cover rounded-md shadow-sm"
                                        />
                                        <div>
                                            <h3 className="font-medium text-gray-900 hover:text-red-500 transition-colors">
                                                <Link to={`/shop/${item._id}`}>{item.name}</Link>
                                            </h3>
                                            <button 
                                                onClick={() => handleRemoveFromWishlist(item.id)}
                                                className="text-xs text-red-500 mt-1 flex items-center hover:underline"
                                            >
                                                <i className="ri-delete-bin-line mr-1"></i> Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center font-bold text-gray-900">
                                        Tk. {Number(item.price).toLocaleString('en-IN')}
                                    </div>

                                    {/* Stock Status */}
                                    <div className="text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            item.quantity > 0 || item.stock === "In Stock" 
                                            ? "bg-green-100 text-green-700" 
                                            : "bg-red-100 text-red-700"
                                        }`}>
                                            {item.quantity > 0 || item.stock === "In Stock" ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </div>

                                    {/* Action Button */}
                                    <div className="text-right">
                                        <button 
                                            onClick={() => handleAddToCart(item)}
                                            disabled={item.quantity <= 0 && item.stock !== "In Stock"}
                                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                item.quantity > 0 || item.stock === "In Stock"
                                                ? "bg-black text-white hover:bg-gray-800" 
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            Order Now
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                <i className="ri-heart-line text-4xl text-gray-300"></i>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Your wishlist is empty!</h2>
                        <p className="text-gray-500 mt-2 mb-8">Seems like you haven't added anything yet.</p>
                        <Link 
                            to="/shop" 
                            className="bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-all"
                        >
                            Back to Shop
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;