import React, { useState } from 'react';
import ProductCards from '../shop/ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import { BarLoader } from 'react-spinners';

const TrendingProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState(8); 
    const [activeCategory, setActiveCategory] = useState('All');
    
    // ১. Load More er jonno notun state
    const [isButtonLoading, setIsButtonLoading] = useState(false);

    const { data: productData, error, isLoading } = useFetchAllProductsQuery({
        category: '',
        color: '',
        minPrice: '',
        maxPrice: '',
        page: 1,
        limit: 50 
    });

if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white/50">
            <BarLoader color="#ff4d4d" width={150} />
        </div>
    );
}
    if (error) return <div className='text-center py-10 text-red-500'>Error loading products.</div>;

    const products = productData?.data?.products || [];
    const categories = ["All", "Casual Shirt", "Formal Shirt", "Sweaters", "Panjabi"];

    const filteredProducts = activeCategory === 'All' 
        ? products 
        : products.filter(p => p.category?.trim().toLowerCase() === activeCategory.toLowerCase());

    // ২. Load More Function-e loading effect add kora hoyeche
    const loadMore = () => {
        setIsButtonLoading(true); // Loading shuru
        
        // Ekta chotto timeout jate user loading effect-ti dekhte pay
        setTimeout(() => {
            setVisibleProducts(prevCount => prevCount + 4);
            setIsButtonLoading(false); // Loading sesh
        }, 800); 
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-y-6">
                    <div>
                        <h4 className="text-2xl font-bold uppercase tracking-widest text-gray-900 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-0.5 after:bg-red-500">
                            New Arrivals
                        </h4>
                    </div>
                    <nav>
                        <ul className="flex flex-wrap items-center gap-6 md:gap-10 text-sm font-semibold uppercase tracking-widest">
                            {categories.map((cat) => (
                                <li 
                                    key={cat}
                                    onClick={() => {
                                        setActiveCategory(cat);
                                        setVisibleProducts(8); 
                                    }}
                                    className={`cursor-pointer transition-all duration-300 border-b-2 pb-1 ${
                                        activeCategory === cat 
                                        ? "text-gray-900 border-red-500" 
                                        : "text-gray-400 border-transparent hover:text-gray-900"
                                    }`}
                                >
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Product Grid */}
                <div className="">
                   <ProductCards filteredProducts={filteredProducts.slice(0, visibleProducts)} />
                </div>

                {/* ৩. Load More Button with Loading state */}
                <div className="text-center">
                    {visibleProducts < filteredProducts.length && (
                        <div className="flex flex-col items-center gap-4">
                            {/* Button click korle jodi loading hoy tokhon chotto spinner dekhabe */}
                            {isButtonLoading && <BarLoader />} 
                            
                            {!isButtonLoading && (
                                <button 
                                    onClick={loadMore} 
                                    className="px-10 py-3 bg-white border-2 border-gray-900 text-gray-900 font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-300 shadow-sm"
                                >
                                    Load More
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default TrendingProducts;