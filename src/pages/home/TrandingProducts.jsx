import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCards from '../shop/ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import { BarLoader } from 'react-spinners';

const TrendingProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState(8); 
    const [activeCategory, setActiveCategory] = useState('All');
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
    const categories = ["All", "Casual Shirt", "Formal Shirt", "Sweaters", "Panjabi", "Kurti"];

    const filteredProducts = activeCategory === 'All' 
        ? products 
        : products.filter(p => p.category?.trim().toLowerCase() === activeCategory.toLowerCase());

    const loadMore = () => {
        setIsButtonLoading(true);
        setTimeout(() => {
            setVisibleProducts(prevCount => prevCount + 4);
            setIsButtonLoading(false);
        }, 800); 
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h4 className="text-2xl font-bold uppercase tracking-widest text-gray-900 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-0.5 after:bg-red-500">
                            New Arrivals
                        </h4>
                    </motion.div>

                    <nav>
                        <ul className="flex flex-wrap items-center gap-6 md:gap-10 text-sm font-semibold uppercase tracking-widest">
                            {categories.map((cat, idx) => (
                                <motion.li 
                                    key={cat}
                                    initial={{ opacity: 0, y: -10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => {
                                        setActiveCategory(cat);
                                        setVisibleProducts(8); 
                                    }}
                                    className={`relative cursor-pointer transition-all duration-300 pb-1 ${
                                        activeCategory === cat ? "text-gray-900" : "text-gray-400 hover:text-gray-900"
                                    }`}
                                >
                                    {cat}
                                    {/* Active Tab Underline Animation */}
                                    {activeCategory === cat && (
                                        <motion.div 
                                            layoutId="activeTab"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500"
                                        />
                                    )}
                                </motion.li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Product Grid Area */}
                <motion.div layout>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory + visibleProducts} // Key change holei animation trigger hobe
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <ProductCards filteredProducts={filteredProducts.slice(0, visibleProducts)} />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Load More Button */}
                <div className="text-center mt-8">
                    <AnimatePresence>
                        {visibleProducts < filteredProducts.length && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-4"
                            >
                                {isButtonLoading ? (
                                    <motion.div 
                                        initial={{ scale: 0.8 }} 
                                        animate={{ scale: 1 }}
                                        transition={{ repeat: Infinity, duration: 0.5, repeatType: "reverse" }}
                                    >
                                        <BarLoader color="#ff4d4d" />
                                    </motion.div>
                                ) : (
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={loadMore} 
                                        className="px-10 py-3 bg-white border-2 border-gray-900 text-gray-900 font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-300 shadow-sm"
                                    >
                                        Load More
                                    </motion.button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

export default TrendingProducts;