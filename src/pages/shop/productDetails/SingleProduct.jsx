import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFetchProductByidQuery } from '../../../redux/features/products/productsApi';
import Loading from '../../../components/Loading';
import RatingStar from '../../../components/RatingStar';
import ReviewsCard from '../reviews/ReviewsCard';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cart/CartSlice';
import { addToWishlist } from '../../../redux/features/wishlistSlice/wishlistSlice';
import toast from 'react-hot-toast';

const SingleProduct = () => {
    // ডিফল্ট ট্যাব হিসেবে 'Additional information' রাখা হয়েছে
    const [activeTab, setActiveTab] = useState('Additional information');
    const { id } = useParams();
    const dispatch = useDispatch();

    const [selectedSize, setSelectedSize] = useState("");

    const { data: { data: productDetails } = {}, isLoading, isError } = useFetchProductByidQuery(id);
    const { product, reviews } = productDetails || {}

    if (isLoading) return <Loading />
    if (isError) return <div className='flex items-center justify-center h-96'>Error to load Product Details</div>;

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please Select Product Size!");
            return;
        }

        dispatch(addToCart({
            ...product,
            size: selectedSize
        }));

        toast.success("Product added to cart!");
    }

    const handleWishlistClick = (product) => {
        dispatch(addToWishlist(product));
    };

    return (
        <>
            <section className="section__container mt-8">
                <div className="flex flex-col items-start md:flex-row gap-12">
                    {/* Product Image */}
                    <div className="w-full md:w-1/2 flex justify-center items-start">
                        <div className="w-full max-w-sm shadow-md rounded-lg overflow-hidden border border-gray-100">
                            <img
                                src={product?.image}
                                alt={product?.name}
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="w-full md:w-1/2">
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">{product?.name}</h3>

                        <div className="flex items-center gap-4 mb-4">
                            <p className="text-2xl font-semibold text-primary">
                                TK {product?.price?.toLocaleString('en-IN')}
                            </p>
                            {product?.oldprice && (
                                <p className="text-xl text-red-400 line-through">
                                    Tk {product?.oldprice?.toLocaleString('en-IN')}
                                </p>
                            )}
                        </div>

                        <div className='flex gap-2 items-center mb-4'>
                            <RatingStar rating={product?.rating} />
                            <span className="text-sm">({product?.rating} reviews)</span>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-gray-200">
                            <p className='capitalize'><strong>Category:</strong> <span className="text-gray-600">{product?.category}</span></p>
                            <p className='capitalize'><strong>Color:</strong> <span className="text-gray-600">{product?.color}</span></p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-gray-200 mt-4">
                            <p className='capitalize'>
                                <strong>SKU:</strong> <span className="text-gray-600 pb-5">{product?.sku}</span> <br />
                                <span className='mt-5 -mb-4'>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.quantity > 0 || product.stock === "In Stock"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}>
                                        {product.quantity > 0 || product.stock === "In Stock" ? "In Stock" : "Out of Stock"}
                                    </span>
                                </span>
                            </p>

                            <div className='flex flex-col gap-2'>
                                <strong>Select Size:</strong>
                                <div className="flex flex-wrap gap-2">
                                    {product?.size?.map((s, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSize(s)}
                                            className={`px-4 py-2 text-sm border transition-all rounded-md uppercase font-medium
                                            ${selectedSize === s
                                                    ? "bg-black text-white border-black shadow-lg"
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                {selectedSize && (
                                    <p className="text-sm text-green-600 font-medium mt-1">
                                        Selected: {selectedSize}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 mt-6">
                            <button
                                disabled={product.quantity <= 0 && product.stock !== "In Stock"}
                                onClick={handleAddToCart}
                                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${product.quantity > 0 || product.stock === "In Stock"
                                    ? "bg-black text-white hover:bg-gray-800"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {/* এখানে আইকন এবং টেক্সট রাখা হয়েছে, আপনি চাইলে শুধু আইকনও রাখতে পারেন */}
                                <i className="ri-shopping-cart-2-line text-lg"></i>
                                <span>Order Now</span>
                            </button>


                            <button
                                onClick={() => handleWishlistClick(product)}
                                className="px-6 py-2 rounded-lg text-sm font-semibold transition-all bg-black text-white hover:bg-gray-800"
                            >
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section_container mt-10 border-t border-gray-100 pt-8">
                {/* ১. ট্যাব লিস্ট */}
                <div className="flex justify-center mb-8">
                    <ul className="flex space-x-8 md:space-x-12 border-b w-full justify-center">
                        {['Additional information', 'description', 'features', 'reviews'].map((tab) => (
                            <li
                                key={tab}
                                className={`cursor-pointer pb-4 text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-300 relative ${activeTab === tab
                                    ? 'text-orange-500 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-500'
                                    : 'text-gray-400 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ২. ট্যাবের কন্টেন্ট সমূহ */}
                <div className="max-w-4xl mx-auto px-4 min-h-[200px] mb-12">

                    {/* --- Static Content: Additional Information --- */}
                    {activeTab === 'Additional information' && (
                        <div className="animate-fadeIn text-gray-700 leading-relaxed">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                🚚 Delivery, Guarantee & Payment Policy
                            </h3>
                            <p className="mb-4 italic text-gray-600">
                                At TopZ Fashions, your trust comes first. We are committed to providing premium quality modest fashion with a 100% secure and transparent shopping experience.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
                                    <h4 className="font-bold mb-2">💳 100% Paid on Delivery</h4>
                                    <ul className="text-sm space-y-1">
                                        <li>✔ All Over Bangladesh</li>
                                        <li>✔ Full Paid service available</li>
                                        <li>✔ No hidden conditions</li>
                                        <li>✔ Pay only Before receiving your product</li>
                                    </ul>
                                    <p className="text-xs mt-2 font-medium text-orange-600">Shop with confidence. You pay when the product is delivered to your doorstep.</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    <h4 className="font-bold mb-2">📦 Home Delivery Nationwide</h4>
                                    <p className="text-sm mb-2">We deliver safely and reliably to all districts of Bangladesh.</p>
                                    <ul className="text-sm space-y-1">
                                        <li>📍 <strong>Inside Dhaka Metro:</strong> Fast delivery within 48 hours</li>
                                        <li>📍 <strong>Outside Dhaka:</strong> Delivery within 2–4 working days</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description Content */}
                    {activeTab === 'description' && (
                        <div className="animate-fadeIn text-gray-600 leading-relaxed text-justify">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Product Information</h3>
                            {/* whitespace-pre-line ক্লাসটি যোগ করা হয়েছে */}
                            <p className="whitespace-pre-line">{product?.description}</p>
                        </div>
                    )}

                    {/* Features Content */}
                    {activeTab === 'features' && (
                        <div className="animate-fadeIn">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                                <div className="flex justify-between border-b py-3">
                                    <span className="font-semibold text-gray-700">Category</span>
                                    <span className="text-gray-600 capitalize">{product?.category}</span>
                                </div>
                                <div className="flex justify-between border-b py-3">
                                    <span className="font-semibold text-gray-700">Color</span>
                                    <span className="text-gray-600 capitalize">{product?.color || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b py-3">
                                    <span className="font-semibold text-gray-700">SKU</span>
                                    <span className="text-gray-600">{product?.sku}</span>
                                </div>
                                <div className="flex justify-between border-b py-4 items-center">
                                    <span className="font-bold text-gray-700 uppercase text-xs tracking-wider">Available Sizes</span>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(product?.size) ? (
                                            product.size.map((s, index) => (
                                                <span key={index} className="px-3 py-1 border border-gray-300 text-gray-600 text-xs font-semibold rounded-sm uppercase bg-gray-50">{s}</span>
                                            ))
                                        ) : (
                                            <span className="px-3 py-1 border border-gray-300 text-gray-600 text-xs font-semibold rounded-sm uppercase">{product?.size || 'N/A'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reviews Content */}
                    {activeTab === 'reviews' && (
                        <div className="animate-fadeIn">
                            <ReviewsCard productReviews={reviews} />
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default SingleProduct