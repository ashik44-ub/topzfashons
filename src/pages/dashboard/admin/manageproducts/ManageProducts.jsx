import React, { useState } from 'react'
import { useDeleteProductMutation, useFetchAllProductsQuery } from '../../../../redux/features/products/productsApi';
import Loading from '../../../../components/Loading';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageProducts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);

    const [deleteProduct] = useDeleteProductMutation()

    const { data: productsData = {}, error, isLoading, refetch } = useFetchAllProductsQuery({
        category: '',
        color: '',
        minPrice: '',
        maxPrice: '',
        page: currentPage,
        limit: productsPerPage
    });

    if (isLoading) return <Loading />

    const { products, totalProducts, totalPages } = productsData?.data || {};

    const handleDelete = async (id) => {
        // ১. ইউজারকে কনফার্মেশন জিজ্ঞাসা করা
        const confirmDelete = window.confirm("Are you sure you want to delete this product? This action cannot be undone.");

        // ২. যদি ইউজার 'OK' (Yes) ক্লিক করে তবেই ডিলিট হবে
        if (confirmDelete) {
            try {
                const response = await deleteProduct(id).unwrap();
                toast.success("Product deleted successfully!")
                await refetch();
            } catch (error) {
                console.error("Failed to delete the product:", error);
                toast.error("An error occurred while deleting the product.");
            }
        } else {
            // ৩. যদি ইউজার 'Cancel' (No) ক্লিক করে
            console.error("Delete action cancelled by user.");
        }
    };

    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = startProduct + products.length - 1;

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber)
        }
    }

    return (
        <>
            <section className="py-1 bg-blueGray-50">
                <div className="w-full mb-12 xl:mb-0 px-4 mx-auto">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
                        <div className="rounded-t mb-0 px-4 py-3 border-0">
                            <div className="flex flex-wrap items-center">
                                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                    <h3 className="font-semibold text-base text-blueGray-700">
                                        All Products
                                    </h3>
                                </div>
                                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                                    <Link to="/shop">
                                        <button
                                            className="bg-black text-white hover:bg-gray-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                        >
                                            See all
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <h3 className='text-sm my-4'>Showing {startProduct} to {endProduct} of {totalProducts} products</h3>
                        </div>

                        <div className="block w-full overflow-x-auto">
                            <table className="items-center bg-transparent w-full border-collapse ">
                                <thead>
                                    <tr>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            No.
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Product Image
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Product name
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Publishing date
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Edit or manage
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        products && products.map((product, index) => (
                                            <tr key={index}>

                                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                                                    {index + 1}
                                                </th>
                                                <td className="px-6 py-4 align-middle">
                                                    <Link to={`/shop/${product?._id}`} className="block w-16 h-16 group">
                                                        <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-md">
                                                            {product?.image ? (
                                                                <img
                                                                    src={product.image}
                                                                    alt={product?.name}
                                                                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                                                                    <i className="ri-image-line text-2xl"></i>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </td>
                                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 cursor-pointer hover:text-primary">
                                                    <Link to={`/shop/${product?._id}`}>{product?.name}</Link>
                                                </th>

                                                <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                    {new Date(product?.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                                                    <Link
                                                        to={`/dashboard/update-product/${product?._id}`}
                                                        className="bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-700 transition-all duration-200 inline-block shadow-sm"
                                                    >
                                                        <span className="flex gap-1.5 items-center justify-center font-medium">
                                                            <i className="ri-edit-line text-sm"></i> {/* Remix Icon ব্যবহার করলে */}
                                                            Edit
                                                        </span>
                                                    </Link>
                                                </td>
                                                <td className="border-t-0  px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                    <button className="bg-red-600 text-white px-2 py-1"
                                                        onClick={() => handleDelete(product?._id)}
                                                    >Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination controls */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-black hover:bg-gray-600 text-white' : 'bg-gray-300 text-gray-700'} rounded-md mx-1`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-2"
                    >
                        Next
                    </button>
                </div>
            </section>
        </>
    )
}

export default ManageProducts