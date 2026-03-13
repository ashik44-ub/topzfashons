import React, { useState } from 'react'; // 1. useState import koro
import { useGetOrdersByEmailQuery } from '../../../../redux/features/orders/orderApi';
import Loading from '../../../../components/Loading';
import { useSelector } from 'react-redux';

const UserPayments = () => {
    const { user } = useSelector((state) => state.auth);
    const { data, isLoading, error } = useGetOrdersByEmailQuery(user?.email);

    // 2. Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Proti page-e 4ti item

    if (isLoading) return <Loading />;
    if (error) return <div className="p-5 text-red-500 font-medium text-center">User Data Fetch Failed!</div>;

    const orders = data?.data || [];

    // 3. Logic: Current Page-er data ber kora
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    // 4. Total Pages calculation
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    const totalPayment = orders.reduce((acc, order) => acc + (order.amount || 0), 0);

    // Page change function
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="py-8 px-4 max-w-4xl mx-auto">
            <div className="mb-6 border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-800">Payment History</h3>
                <p className="text-gray-500">View and manage your recent transactions</p>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl shadow-md text-white mb-8">
                <p className="text-blue-100 text-sm uppercase tracking-wider font-semibold">Total Amount Spent</p>
                <h2 className="text-4xl font-extrabold mt-1">
                    Tk. {totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
            </div>

            <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                <ul className="divide-y divide-gray-100">
                    {currentOrders.length > 0 ? (
                        currentOrders.map((item, index) => (
                            <li key={item._id || index} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                Order #{indexOfFirstItem + index + 1}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">Transaction ID: {item.transactionId}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            Tk. {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                            item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            item.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-10 text-center text-gray-500">No orders found.</li>
                    )}
                </ul>
            </div>

            {/* 5. Pagination Buttons */}
            {orders.length > itemsPerPage && (
                <div className="mt-6 flex justify-center items-center gap-2">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                        Prev
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-4 py-2 rounded-md transition ${
                                currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserPayments;