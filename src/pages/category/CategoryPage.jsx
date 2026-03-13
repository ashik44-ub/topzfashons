import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductCards from '../shop/ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import Loading from '../../components/Loading';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    
    // filteredProducts এখন একটি অ্যারে হিসেবে শুরু হবে
    const [filteredProducts, setFilteredProducts] = useState([]);

    // API থেকে ডাটা নিয়ে আসা (limit আমরা ফিক্সড ১২ দিয়েছি)
    const { data: productsData = {}, error, isLoading } = useFetchAllProductsQuery({
        category: '',
        color: '',
        minPrice: '',
        maxPrice: '',
        page: currentPage,
        limit: filteredProducts // সব ডাটা নিয়ে এসে ফ্রন্টএন্ডে জেন্ডার অনুযায়ী ফিল্টার করার জন্য
    });

    // API রেসপন্স থেকে প্রোডাক্ট অ্যারেটি বের করা
    const allProducts = productsData?.data?.products || [];

    useEffect(() => {
        if (allProducts.length > 0) {
            const lowerCaseCategory = categoryName?.toLowerCase();

            const filtered = allProducts.filter((product) => {
                const prodCat = product.category.toLowerCase();
                const prodGender = product.gender.toLowerCase();

                // ক্যাটাগরি অথবা জেন্ডার (man/men, woman/women) চেক করা
                const isGenderMatch = 
                    prodGender === lowerCaseCategory || 
                    (lowerCaseCategory === 'woman' && prodGender === 'women') ||
                    (lowerCaseCategory === 'man' && prodGender === 'men');

                return prodCat === lowerCaseCategory || isGenderMatch;
            });

            setFilteredProducts(filtered);
        }
    }, [categoryName, allProducts]); // ক্যাটাগরি বা ডাটা আপডেট হলে এটি রান করবে

    if (isLoading) return <Loading/>;
    if (error) return <div className="text-center py-20 text-red-500">Something went wrong!</div>;

    return (
        <div className="bg-white min-h-screen">
            {/* Category Header */}
            <div className="bg-gray-50 py-12 mb-10 border-b">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold uppercase tracking-widest text-gray-900 mb-4">
                        {categoryName}
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
                        {filteredProducts?.length > 0 
                          ? `Showing ${filteredProducts.length} items for ${categoryName}. Quality pieces designed for your everyday lifestyle.` 
                          : `Sorry, no products found in ${categoryName}.`}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-20">
                {/* ProductCards কে filteredProducts প্রপস হিসেবে পাঠানো হচ্ছে */}
                <ProductCards filteredProducts={filteredProducts} /> 
            </div>
        </div>
    )
}

export default CategoryPage;