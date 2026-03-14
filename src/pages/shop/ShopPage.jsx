import React, { useState } from 'react';
import ProductCards from '../shop/ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import Loading from '../../components/Loading';
import ShopFiltering from './ShopFiltering';
import { Link } from 'react-router-dom';

//5
const filters = {
  categories: ["all", "panjabi", "sweaters", "casual shirt", "formal shirt", "kurti"],
  colors: ["all", "black", "red", "gold", "blue", "silver", "beige", "green", "orange"],
  priceRanges: [
    { label: "Under Tk. 200", min: 0, max: 200 },
    { label: "Tk. 200 - Tk. 400", min: 200, max: 400 },
    { label: "Tk. 400 - Tk. 500", min: 400, max: 500 },
    { label: "Tk. 500 and above", min: 500, max: Infinity }
  ]
}

const ShopPage = () => {

             //3 or 4 korar somoy korte hobe
         const [currentPage, setCurrentPage] = useState(1);
             //6
           const [filterState, setFilterState] = useState({
                category: 'all',
                color: 'all',
                priceRange: ''
            });
            // uporer fitlerstate ke destructure korte hobe
              const { category, color, priceRange } = filterState;

                // 7 
        const [minPrice, maxPrice] = priceRange.split('-').map(Number)
               //11
       const [productPerPage, setProductPerPage] = useState(12);
         // 1
         const {data: productData = {}, error, isLoading} = useFetchAllProductsQuery({
            // 8
            category: category !== 'all' ? category : '',
            //9
            color: color !== 'all' ? color : '',
            //10
            minPrice: isNaN(minPrice) ? '' : minPrice,
            maxPrice: isNaN(maxPrice) ? '' : maxPrice,
            page: currentPage,
            limit: productPerPage

         });


         if (isLoading) return <Loading/>;
        //2
         const {products, totalPages, totalProducts} = productData?.data || {};
         //2
        //  /console.log(products)

        // 11
        const handlePageChange = (pageNumber) => {
            if (pageNumber > 0 && pageNumber <= totalPages) {
                setCurrentPage(pageNumber)
            }
        }
        //12
          const clearFilters = () => {
                setFilterState({
                category: 'all',
                color: 'all',
                priceRange: ''
                })
            }
        //3
         const startPage = (currentPage -1) * productPerPage +1;
         //4
         const endProduct = startPage + products.length - 1;
         

         
    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb Section */}
            <div className="bg-gray-50 py-10">
                <div className="container bg-red-400 text-center mx-auto p-4">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-gray-900">Shop</h2>
                    <p className="text-sm text-white mt-2"><Link className='underline' to={"/"}>Home</Link> / <span className="text-red-500 font-bold">Shop</span></p>
                    
                </div>
            </div>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* --- Sidebar (Filters) --- */}
                        <ShopFiltering
                        filters={filters}
                        filterState={filterState}
                        setFilterState={setFilterState}
                        clearFilters={clearFilters}
                        />

                        {/* --- Main Content (Product Grid) --- */}
                        <main className="w-full lg:w-3/4">
                            <h3 className='text-xl font-medium mb-4'>Showing {startPage} to {endProduct} of {totalProducts} products</h3>
                            {/* Product List */}

                            <ProductCards filteredProducts={products}/>
                           
                            {/* Pagination */}
                            {
                                products.length > 0 && <div className="-mt-16 flex justify-center gap-2">
                                <button
                                disabled={currentPage === 1}
                                onClick={()=> handlePageChange(currentPage - 1)}
                                className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-900 hover:text-white transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
                                {
                                [...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    // ✅ Return keyword jog kora hoyeche
                                    return (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`h-10 w-10 flex items-center justify-center border border-gray-200 rounded-full ${
                                        currentPage === pageNumber 
                                        ? 'bg-gray-300 font-bold' 
                                        : 'bg-white hover:bg-gray-900 hover:text-white transition-all text-sm font-bold'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                    );
                                })
                                }
                                <button 
                                disabled={currentPage === totalPages}
                                onClick={()=> handlePageChange(currentPage + 1)}
                                className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-900 hover:text-white transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                            </div>
                            }
                            

                        </main>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShopPage;