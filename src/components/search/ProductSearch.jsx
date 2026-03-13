import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import ProductCards from '../../pages/shop/ProductCards';
import Loading from '../Loading';

const ProductSearch = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('query') || "";

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // ১. API থেকে ডেটা আনা
    const { data: productsData, isLoading, error } = useFetchAllProductsQuery({
        page: 1,
        limit: 100
    });

    // ২. Debounce Logic (সার্চ করার সময় URL আপডেট করবে)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            if (searchQuery.trim()) {
                navigate(`?query=${searchQuery}`, { replace: true });
            } else {
                navigate(location.pathname, { replace: true });
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery, navigate, location.pathname]);

    // ৩. ফিল্টারিং লজিক (আপডেট করা হয়েছে)
    const allFilteredProducts = useMemo(() => {
        let products = [];

        // API ডাটা স্ট্রাকচার চেক করা
        if (productsData?.data?.products) {
            products = productsData.data.products;
        } else if (Array.isArray(productsData?.data)) {
            products = productsData.data;
        } else if (Array.isArray(productsData)) {
            products = productsData;
        }

        // যদি সার্চ বক্স খালি থাকে, তবে সব প্রোডাক্ট রিটার্ন করবে
        if (!debouncedQuery.trim()) return products;

        const query = debouncedQuery.toLowerCase().trim();

        // সার্চ করলে ফিল্টার করা লিস্ট দেখাবে
        return products.filter(product => {
            const name = (product?.name || product?.title || "").toLowerCase();
            return name.includes(query);
        });
    }, [debouncedQuery, productsData]);

    // ৪. পেজিনেশন ক্যালকুলেশন
    const totalPages = Math.ceil(allFilteredProducts.length / productsPerPage);
    const currentDisplayProducts = allFilteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) return <Loading />;
    if (error) return <div className="text-center py-20 text-red-500 font-semibold">Error loading products.</div>;

    return (
        <div className="min-h-screen bg-gray-50">

            <section className='container mx-auto px-4 py-10'>
                {/* Option 1: Premium & Interactive Search Area */}
                <div className='flex justify-center mb-16'>
                    <div className="relative w-full max-w-2xl group">
                        {/* Left Side: Search Icon */}
                        <i className="ri-search-line absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-gray-400 group-focus-within:text-red-500 transition-colors duration-300"></i>

                        {/* The Premium Input */}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            placeholder="Search for Panjabi, Shirt, or Accessories..."
                            className='w-full p-5 pl-16 pr-16 text-xl text-gray-800 border-2 border-transparent rounded-full shadow-lg outline-none transition-all duration-300 bg-white hover:shadow-red-100 hover:border-red-100 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:shadow-xl'
                        />

                        {/* Right Side: Conditional Clear Button or Loading Spinner */}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                            {/* যদি API লোডিং হয় (Optional: productsApi থেকে isLoading আনতে হবে) */}
                            {/* {isLoading && <i className="ri-loader-4-line text-2xl text-red-400 animate-spin"></i>} */}

                            {/* যদি সার্চবক্সে কিছু লেখা থাকে, তবে Clear (X) বাটন দেখাবে */}
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                                    title="Clear search"
                                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95"
                                >
                                    <i className="ri-close-line text-2xl"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {allFilteredProducts.length > 0 ? (
                    <>
                       <div className="mb-8 flex justify-center items-center">
    <p className="inline-block px-6 py-2 bg-white border border-red-100 rounded-full shadow-sm text-gray-600 font-medium font-sans">
        {debouncedQuery.trim()
            ? (
                <span>
                    Found <span className="text-red-500 font-bold">{allFilteredProducts.length}</span> {allFilteredProducts.length > 1 ? 'Results' : 'Result'}
                </span>
            )
            : (
                <span>
                    Showing <span className="text-red-500 font-bold">all products</span> ({allFilteredProducts.length})
                </span>
            )
        }
    </p>
</div>

                        <ProductCards filteredProducts={currentDisplayProducts} />

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12 pb-10">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="p-2 px-4 bg-white border rounded hover:bg-red-500 hover:text-white disabled:opacity-30 transition-all"
                                > Prev </button>

                                {[...Array(totalPages).keys()].map(n => (
                                    <button
                                        key={n + 1}
                                        onClick={() => handlePageChange(n + 1)}
                                        className={`w-10 h-10 rounded font-semibold transition-all ${currentPage === n + 1 ? 'bg-red-500 text-white' : 'bg-white border hover:border-red-500'}`}
                                    > {n + 1} </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="p-2 px-4 bg-white border rounded hover:bg-red-500 hover:text-white disabled:opacity-30 transition-all"
                                > Next </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <i className="ri-error-warning-line text-6xl text-gray-200 block mb-4"></i>
                        <p className='text-gray-500 text-xl'>No products found matching "<strong>{debouncedQuery}</strong>"</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-red-500 hover:underline font-semibold"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProductSearch;