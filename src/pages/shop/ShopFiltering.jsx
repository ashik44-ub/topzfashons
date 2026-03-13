import React from 'react'

const ShopFiltering = ({ filters, filterState, setFilterState, clearFilters }) => {
    return (
        <aside className="w-full lg:w-1/4 space-y-10">
            {/* Categories */}
            <div className="max-w-xs p-4 bg-white shadow-sm rounded-lg">
                {/* Header Section */}
                <h5 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-red-500 inline-block pb-1 text-gray-800">
                    Categories
                </h5>

                {/* Categories List */}
                <ul className="space-y-2">
                    {filters.categories.map((category) => (
                        <li key={category} className="list-none">
                            <label className="flex items-center p-2 rounded-md transition-all duration-200 cursor-pointer group hover:bg-red-50">
                                {/* Custom Styled Radio */}
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category}
                                        checked={filterState.category === category}
                                        onChange={(e) => setFilterState({ ...filterState, category: e.target.value })}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-red-500 transition-all"
                                    />
                                    {/* Inner Dot for Radio */}
                                    <div className="absolute w-2.5 h-2.5 left-1.25 top-1.25 bg-red-500 rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200 m-auto inset-0" />
                                </div>

                                {/* Label Text */}
                                <span className={`ml-3 text-sm font-medium capitalize transition-colors duration-200 
            ${filterState.category === category ? 'text-red-600' : 'text-gray-600 group-hover:text-red-500'}`}>
                                    {category}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            {/* color filter */}
            <div className="max-w-xs p-4 bg-white shadow-sm rounded-lg">

                <h5 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-red-500 inline-block pb-1 text-gray-800">
                    Colors
                </h5>

                <ul className="space-y-2">
                    {filters.colors.map((color) => (
                        <li key={color} className="list-none">
                            <label className="flex items-center p-2 rounded-md transition-all duration-200 cursor-pointer group hover:bg-red-50">
                                {/* Custom Styled Radio */}
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="color"
                                        value={color}
                                        checked={filterState.color === color}
                                        onChange={(e) => setFilterState({ ...filterState, color: e.target.value })}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-red-500 transition-all"
                                    />
                                    {/* Inner Dot for Radio */}
                                    <div className="absolute w-2.5 h-2.5 left-1.25 top-1.25 bg-red-500 rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200 m-auto inset-0" />
                                </div>

                                {/* Label Text */}
                                <span className={`ml-3 text-sm font-medium capitalize transition-colors duration-200 
            ${filterState.color === color ? 'text-red-600' : 'text-gray-600 group-hover:text-red-500'}`}>
                                    {color}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Price Filter */}
            <div className="max-w-xs p-4 bg-white">
                {/* Section Title */}
                <h5 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-red-500 inline-block pb-1 text-gray-800">
                    Price Range
                </h5>

                <div className="space-y-3">
                    {filters.priceRanges.map((range) => {
                        const rangeValue = `${range.min}-${range.max}`;
                        const isSelected = filterState.priceRange === rangeValue;

                        return (
                            <label
                                key={range.label}
                                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 group
            ${isSelected
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-100 hover:border-red-200 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center">
                                    {/* Custom Styled Radio Circle */}
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="priceRange"
                                            value={rangeValue}
                                            checked={isSelected}
                                            onChange={(e) => setFilterState({ ...filterState, priceRange: e.target.value })}
                                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-red-500 transition-all"
                                        />
                                        <div className="absolute w-2.5 h-2.5 bg-red-500 rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200" />
                                    </div>

                                    {/* Range Label */}
                                    <span className={`ml-3 text-sm font-semibold transition-colors 
              ${isSelected ? 'text-red-700' : 'text-gray-600 group-hover:text-red-500'}`}>
                                        {range.label}
                                    </span>
                                </div>

                                {/* Optional: Checkmark icon or right-side detail */}
                                {isSelected && (
                                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </label>
                        );
                    })}
                </div>
            </div>
                {/* clear filtering btn */}
                <button
                onClick={clearFilters}
                className="text-[12px] px-3 py-1 border border-gray-200 rounded-full hover:border-red-500 hover:text-red-500 transition-all font-semibold uppercase tracking-tight"
                >Clear All Filters</button>
            {/* Banner Filter (Optional) */}
            <div className="bg-gray-900 p-8 text-white rounded-sm relative overflow-hidden group">
                <h4 className="text-xl font-bold mb-2">Summer Sale</h4>
                <p className="text-gray-400 text-xs uppercase tracking-[2px] mb-4">Up to 50% Off</p>
                <button className="text-[10px] font-bold uppercase border-b border-red-500 pb-1">Shop Now</button>
            </div>
        </aside>
    )
}

export default ShopFiltering