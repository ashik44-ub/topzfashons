import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../redux/features/cart/CartSlice';
import OrderSummery from './OrderSummery';

const CartModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux store থেকে প্রোডাক্টগুলো নিয়ে আসা
    const products = useSelector((state) => state.cart.products);

    // মডাল ওপেন হলে পেছনের পেজের স্ক্রল বন্ধ করার জন্য
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleClose = () => {
        navigate(-1);
    };

    // এখানে ৩টি প্যারামিটার লাগবে: type, id, এবং size
    const handleUpdateQuantity = (type, id, size) => {
        dispatch(updateQuantity({ type, id, size }));
    };

    const modalContent = (
        <div className="fixed inset-0 z-[1000000] flex justify-end">
            {/* ১. ব্যাকড্রপ/ওভারলে */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            ></div>

            {/* ২. সাইডবার কন্টেন্ট */}
            <div className="relative w-full md:w-[400px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right z-[1000001]">
                <div className="p-6 flex flex-col h-full">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <h4 className="text-2xl font-bold text-gray-800">Your Cart</h4>
                        <button 
                            onClick={handleClose} 
                            className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500 hover:text-red-500"
                        >
                            <i className="ri-close-line text-2xl"></i>
                        </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {products && products.length > 0 ? (
                            products.map((product, index) => (
                                // key হিসেবে ID এবং Size এর কম্বিনেশন ব্যবহার করা হয়েছে
                                <div key={`${product._id}-${product.size}`} className="flex gap-4 border-b py-4 items-center">
                                    <img 
                                        src={product?.image} 
                                        className="w-16 h-16 object-cover rounded-lg border" 
                                        alt={product?.name} 
                                    />
                                    
                                    <div className="flex-1">
                                        <h5 className="font-semibold text-sm text-gray-800 line-clamp-1">{product?.name}</h5>
                                        <p className="text-primary font-bold text-sm">Tk. {Number(product?.price).toLocaleString('en-IN')}</p>
                                        
                                        <div className="flex items-center justify-between mt-2">
                                            {/* Quantity Control */}
                                            <div className="flex items-center border rounded-md bg-gray-50">
                                                <button 
                                                    onClick={() => handleUpdateQuantity('decrement', product._id, product.size)}
                                                    className="px-2 py-0.5 hover:bg-gray-200"
                                                >-</button>
                                                <span className="px-2 text-xs font-bold">{product.quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity('increment', product._id, product.size)}
                                                    className="px-2 py-0.5 hover:bg-gray-200"
                                                >+</button>
                                            </div>

                                            {/* Size Badge */}
                                            <div className="flex items-center border rounded-md bg-gray-100 px-3 py-0.5">
                                                <span className='text-[10px] font-bold uppercase'>{product?.size}</span>
                                            </div>

                                            {/* Remove Button */}
                                            <button 
                                                onClick={() => dispatch(removeFromCart({ id: product._id, size: product.size }))}
                                                className="text-red-500 text-xs hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-gray-400">
                                <i className="ri-shopping-cart-line text-5xl"></i>
                                <p className="mt-2">Your cart is empty!</p>
                            </div>
                        )}
                    </div>

                    {/* Summary Section */}
                    {products && products.length > 0 && (
                        <div className="mt-auto pt-4 border-t">
                            <OrderSummery />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(
        modalContent,
        document.getElementById('cart-portal')
    );
};

export default CartModal;