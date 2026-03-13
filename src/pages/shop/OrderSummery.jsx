import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '../../redux/features/cart/CartSlice'
import axios from 'axios';
import { getBaseUrl } from '../../utils/getBaseUrl';
import { Link } from 'react-router-dom';

const OrderSummery = () => {
    // Redux store থেকে ডাটা নেওয়া
    const { products, selectedItems, totalPrice } = useSelector((state) => state.cart)
    const {user} = useSelector((state)=> state.auth)
    const dispatch = useDispatch()

    const handleClearCart = () => {
        // নিশ্চিত হওয়ার জন্য একটি কনফার্মেশন দেওয়া ভালো
        if (window.confirm("Are you sure you want to clear your cart?")) {
            dispatch(clearCart())
        }
    }

    // totalPrice যদি নম্বর না হয় তবে ডিফল্ট ০ সেট করা
    const safeTotalPrice = totalPrice || 0;
    

    // make payment 
const makePayment = async () => {
    if (!user?._id) {
        alert("Please Login First!");
        return;
    }

    const body = {
        products: products.map(p => ({
            productId: p._id,
            quantity: p.quantity
        })),
        userId: user._id,
        // username যদি user অবজেক্টে না থাকে তবে email এর প্রথম অংশ বা 'Customer' দিন
        username: user.username || user.name || "Customer", 
        email: user.email,
        amount: Number(totalPrice), // Redux থেকে আসা totalPrice ব্যবহার করা হলো
    };

    // console.log("Sending to Backend:", body);

    try {
        const response = await axios.post(`${getBaseUrl()}/order`, body);

        if (response.data?.url) {
            window.location.replace(response.data.url);
        }
    } catch (error) {
        console.error("Payment Error:", error.response?.data);
        alert("পেমেন্ট শুরু করা যায়নি।");
    }
};
    return (
        <div className="bg-gray-50 mt-5 rounded-lg shadow-sm border border-gray-100">
            <div className="px-6 py-4 space-y-3">
                <h1 className="text-xl font-bold text-gray-800 border-b pb-2">Order Summary</h1>
                <div className="flex justify-between items-center text-gray-700">
                    <span>Selected Items:</span>
                    <span className="font-semibold">{selectedItems}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-primary">
                    <span>Total Price:</span>
                    <span>
                        Tk. {safeTotalPrice.toLocaleString('en-US', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                        })}
                    </span>
                </div>
            </div>

            <div className="px-6 pb-6 space-y-3">
                {/* Clear Cart Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClearCart();
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white py-2 rounded-md flex justify-center items-center gap-2 text-sm font-medium"
                >
                    <span>Clear Cart</span>
                    <i className="ri-delete-bin-line"></i>
                </button>

                {/* Checkout Button */}
                <Link to={"/checkout"} 
                    className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white py-2 rounded-md flex justify-center items-center gap-2 text-sm font-medium"
                >
                    <span>Proceed Checkout</span>
                    <i className="ri-bank-card-line"></i>
                </Link>
            </div>
        </div>
    )
}

export default OrderSummery