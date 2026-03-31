import React from 'react';
import { motion } from 'framer-motion';

const ShopFiltering = ({ filters, filterState, setFilterState, clearFilters }) => {
    
    // Animation Variants
    const sidebarVariants = {
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
        <motion.aside 
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/4 space-y-10"
        >
            {/* Categories Section */}
            <motion.div variants={sectionVariants} className="max-w-xs p-4 bg-white shadow-sm rounded-lg">
                <h5 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-red-500 inline-block pb-1 text-gray-800">
                    Categories
                </h5>
                <ul className="space-y-2">
                    {filters.categories.map((category) => (
                        <motion.li 
                            key={category} 
                            whileHover={{ x: 5 }} 
                            className="list-none"
                        >
                            <label className="flex items-center p-2 rounded-md transition-all duration-200 cursor-pointer group hover:bg-red-50">
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category}
                                        checked={filterState.category === category}
                                        onChange={(e) => setFilterState({ ...filterState, category: e.target.value })}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-red-500 transition-all"
                                    />
                                    <motion.div 
                                        initial={false}
                                        animate={{ scale: filterState.category === category ? 1 : 0 }}
                                        className="absolute w-2.5 h-2.5 bg-red-500 rounded-full m-auto inset-0" 
                                    />
                                </div>
                                <span className={`ml-3 text-sm font-medium capitalize transition-colors duration-200 
                                    ${filterState.category === category ? 'text-red-600' : 'text-gray-600 group-hover:text-red-500'}`}>
                                    {category}
                                </span>
                            </label>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Color Filter Section */}
            <motion.div variants={sectionVariants} className="max-w-xs p-4 bg-white shadow-sm rounded-lg">
                <h5 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-red-500 inline-block pb-1 text-gray-800">
                    Colors
                </h5>
                <ul className="space-y-2">
                    {filters.colors.map((color) => (
                        <motion.li 
                            key={color} 
                            whileHover={{ x: 5 }} 
                            className="list-none"
                        >
                            <label className="flex items-center p-2 rounded-md transition-all duration-200 cursor-pointer group hover:bg-red-50">
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="color"
                                        value={color}
                                        checked={filterState.color === color}
                                        onChange={(e) => setFilterState({ ...filterState, color: e.target.value })}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-red-500 transition-all"
                                    />
                                    <motion.div 
                                        initial={false}
                                        animate={{ scale: filterState.color === color ? 1 : 0 }}
                                        className="absolute w-2.5 h-2.5 bg-red-500 rounded-full m-auto inset-0" 
                                    />
                                </div>
                                <span className={`ml-3 text-sm font-medium capitalize transition-colors duration-200 
                                    ${filterState.color === color ? 'text-red-600' : 'text-gray-600 group-hover:text-red-500'}`}>
                                    {color}
                                </span>
                            </label>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Price Filter Section */}
            <motion.div variants={sectionVariants} className="max-w-xs p-4 bg-white">
                <h5 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-red-500 inline-block pb-1 text-gray-800">
                    Price Range
                </h5>
                <div className="space-y-3">
                    {filters.priceRanges.map((range) => {
                        const rangeValue = `${range.min}-${range.max}`;
                        const isSelected = filterState.priceRange === rangeValue;
                        return (
                            <motion.label
                                key={range.label}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 group
                                    ${isSelected ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-red-200 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="priceRange"
                                            value={rangeValue}
                                            checked={isSelected}
                                            onChange={(e) => setFilterState({ ...filterState, priceRange: e.target.value })}
                                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-red-500 transition-all"
                                        />
                                        <motion.div 
                                            initial={false}
                                            animate={{ scale: isSelected ? 1 : 0 }}
                                            className="absolute w-2.5 h-2.5 bg-red-500 rounded-full" 
                                        />
                                    </div>
                                    <span className={`ml-3 text-sm font-semibold transition-colors 
                                        ${isSelected ? 'text-red-700' : 'text-gray-600 group-hover:text-red-500'}`}>
                                        {range.label}
                                    </span>
                                </div>
                                {isSelected && (
                                    <motion.svg 
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="w-4 h-4 text-red-500" 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </motion.svg>
                                )}
                            </motion.label>
                        );
                    })}
                </div>
            </motion.div>

            {/* Clear Button with Motion */}
            <motion.button
                variants={sectionVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="w-full text-[12px] px-3 py-3 border border-gray-200 rounded-lg hover:border-red-500 hover:text-red-500 transition-all font-semibold uppercase tracking-tight shadow-sm bg-white"
            >
                Clear All Filters
            </motion.button>

            {/* Promo Banner with Animation */}
            <motion.div 
                variants={sectionVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 p-8 text-white rounded-xl relative overflow-hidden group shadow-lg"
            >
                <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-2">Summer Sale</h4>
                    <p className="text-gray-400 text-xs uppercase tracking-[2px] mb-4">Up to 50% Off</p>
                    <button className="text-[10px] font-bold uppercase border-b border-red-500 pb-1 hover:text-red-500 transition-colors">
                        Shop Now
                    </button>
                </div>
                {/* Decorative Background Circle Animation */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -right-10 -bottom-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl" 
                />
            </motion.div>
        </motion.aside>
    );
};

export default ShopFiltering;