import React from 'react'
import RatingStar from '../../components/RatingStar'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/CartSlice'
import { addToWishlist } from '../../redux/features/wishlistSlice/wishlistSlice'
import Reveal from '../../animation/Reveal'

const ProductCards = ({ filteredProducts }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        const selectedSize = product.size && Array.isArray(product.size)
            ? product.size[0]
            : product.size;

        const productWithSingleSize = {
            ...product,
            size: selectedSize 
        };
        dispatch(addToCart(productWithSingleSize));
    };

    const handleWishlistClick = (product) => {
        dispatch(addToWishlist(product));
    };

    return (
        <div className="container mx-auto px-4 pb-20">
            {/* Grid container: Ekhon ekhane Reveal nei, tai layout bhabbe na */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 py-10">
                {
                    filteredProducts?.length > 0 ? (
                        filteredProducts.map((product, index) => {
                            const discount = product?.oldprice && product?.oldprice > product?.price 
                                ? Math.round(((product.oldprice - product.price) * 100) / product.oldprice) 
                                : null;

                            return (
                                /* KHUBI GURUTTOPURNO: 
                                   1. Reveal ekhane map-er bhitore thakbe.
                                   2. key={product._id} thaktei hobe jate Pagination kaj kore.
                                */
                                <Reveal key={product?._id || index}> 
                                    <div className="group pb-10">
                                        <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
                                            <span className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-bold uppercase px-2 py-1">
                                                New
                                            </span>

                                            {discount && (
                                                <span className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[10px] font-bold uppercase px-2 py-1">
                                                    -{discount}%
                                                </span>
                                            )}

                                            <img 
                                                src={product?.image} 
                                                alt={product?.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            />

                                            {/* Action Buttons */}
                                            <ul className="absolute -bottom-16 left-0 w-full flex justify-center space-x-2 transition-all duration-500 group-hover:bottom-6">
                                                <li>
                                                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-all">
                                                        <i className="ri-expand-diagonal-line text-lg"></i>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button onClick={() => handleWishlistClick(product)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-all">
                                                        <i className="ri-heart-line text-lg"></i>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={!(product?.quantity > 0 || product?.stock === "In Stock")}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all 
                                                        ${(product?.quantity > 0 || product?.stock === "In Stock")
                                                            ? "bg-white hover:bg-red-500 hover:text-white cursor-pointer"
                                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                                                        title={!(product?.quantity > 0 || product?.stock === "In Stock") ? "Out of Stock" : "Add to Cart"}
                                                    >
                                                        <i className="ri-shopping-bag-line text-lg"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Product Details */}
                                        <div className="mt-4 text-center">
                                            <h6 className="text-sm font-medium text-gray-900 mb-1 tracking-tight">
                                                <Link to={`/shop/${product?._id}`} className="hover:text-red-500 transition-colors">
                                                    {product?.name}
                                                </Link>
                                            </h6>

                                            <div className="flex justify-center text-yellow-400 text-xs mb-1">
                                                <RatingStar rating={product?.rating} />
                                            </div>

                                            <div className="text-base font-bold text-gray-900">
                                                Tk. {product?.price?.toLocaleString('en-IN')}
                                                {product?.oldprice && product?.oldprice > product?.price && (
                                                    <s className='text-red-500 ml-2 font-normal text-sm'>
                                                        Tk. {product?.oldprice?.toLocaleString('en-IN')}
                                                    </s>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            )
                        })
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <i className="ri-search-line text-5xl text-gray-200"></i>
                            <p className="mt-4 text-gray-500 italic">No products found matching your criteria.</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ProductCards