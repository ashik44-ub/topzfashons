import React, { useState } from 'react'; // 1. useState import koro
import { useSelector } from 'react-redux';
import { useGetOrdersByEmailQuery } from '../../../../redux/features/orders/orderApi';
import Loading from '../../../../components/Loading';
import { Link } from 'react-router-dom';

const UserOrders = () => {
    const { user } = useSelector((state) => state.auth);
    const { data, isLoading, error } = useGetOrdersByEmailQuery(user?.email);

    // 2. Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // Proti page-e 15ti item

    if (isLoading) return <Loading />;
    if (error) return <div className="p-5 text-red-500 text-center">User Data Fetch Failed!</div>;

    const orders = data?.data || [];

    // 3. Logic: Current Page-er data slice kora
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    // 4. Total Pages calculation
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // Page change korle upore niye jabe
    };

    return (
        <section className="py-1 bg-blueGray-50">
            <div className="w-full mb-12 xl:mb-0 px-4 mx-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    {/* Header */}
                    <div className="rounded-t mb-0 px-4 py-3 border-0">
                        <div className="flex flex-wrap items-center">
                            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                <h3 className="font-semibold text-base text-blueGray-700">Your Orders ({orders.length})</h3>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="block w-full overflow-x-auto">
                        <table className="items-center bg-transparent w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase font-semibold text-left">#</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase font-semibold text-left">Transaction ID</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase font-semibold text-left">Date</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase font-semibold text-left">Status</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase font-semibold text-left">Total</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.map((order, index) => {
                                    const status = order.status?.toLowerCase();
                                    return (
                                        <tr key={order._id} className="hover:bg-blueGray-100 transition-colors border-b last:border-0">
                                            <td className="px-6 align-middle text-xs p-4 text-left">{indexOfFirstItem + index + 1}</td>
                                            <td className="px-6 align-middle text-xs p-4 font-mono text-gray-500">{order.transactionId}</td>
                                            <td className="px-6 align-middle text-xs p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 align-middle text-xs p-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    status === 'completed' ? 'bg-green-500 text-white' :
                                                    status === 'pending'   ? 'bg-red-500 text-white' :
                                                    status === 'processing'? 'bg-blue-500 text-white' :
                                                    'bg-gray-400 text-white'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 align-middle text-xs p-4 font-semibold">
                                                Tk. {order.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 align-middle text-xs p-4 text-center">
                                                <Link to={`/orders/${order._id}`} className="text-indigo-500 hover:text-indigo-700 font-bold underline">View Order</Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* 5. Pagination Buttons UI */}
                    {orders.length > itemsPerPage && (
                        <div className="py-4 flex justify-center items-center gap-2 border-t border-blueGray-100">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-3 py-1 bg-gray-200 rounded text-xs disabled:opacity-50 hover:bg-gray-300 transition"
                            >
                                Previous
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3 py-1 rounded text-xs transition ${
                                        currentPage === i + 1 ? "bg-indigo-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="px-3 py-1 bg-gray-200 rounded text-xs disabled:opacity-50 hover:bg-gray-300 transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default UserOrders;