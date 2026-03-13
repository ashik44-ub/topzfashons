import React, { useState } from 'react'
import { useDeleteOrderbyIdMutation, useGetAllOrderQuery } from '../../../../redux/features/orders/orderApi'
import Loading from '../../../../components/Loading';
import { Link } from 'react-router-dom';
import UpdateOrderModal from './UpdateOrderModal';
import toast from 'react-hot-toast';
import { generateInvoice } from '../../../../utils/InvoiceGenerator';

const ManageOrders = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Search State
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, error, refetch } = useGetAllOrderQuery();

    const [deleteOrderByid] = useDeleteOrderbyIdMutation();

    if (isLoading) return <Loading />;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">Failed to fetch orders!</div>;

    const orders = data?.orders || data?.data || (Array.isArray(data) ? data : []);

    // Filter Logic: Order ID ba MongoDB ID-r sathe match korano
    const filteredOrders = orders.filter((order) => {
        const orderId = order?.orderId || order?._id || "";
        return orderId.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleDeleteClick = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await deleteOrderByid(orderId).unwrap();
                toast.success(`Order deleted successfully!`);
                refetch();
            } catch (err) {
                console.error("Failed to delete order:", err);
                alert("Error deleting order.");
            }
        }
    }

    const handleEdit = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    }

    return (
        <section className="section__container p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold">Manage Orders</h2>

                {/* Search Input Box */}
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search by Order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-center">Order ID</th>
                            <th className="py-3 px-4 border-b text-center">Customer</th>
                            <th className="py-3 px-4 border-b text-center">Status</th>
                            <th className="py-3 px-4 border-b text-center">Date</th>
                            <th className="py-3 px-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => (
                                <tr key={order?._id || index} className="hover:bg-gray-50 transition-colors text-center">
                                    <td className="py-3 px-4 border-b text-sm font-medium text-blue-600">
                                        {order?.transactionId || order?._id?.slice(-8)}
                                    </td>
                                    <td className="py-3 px-4 border-b text-sm">{order?.email}</td>
                                    <td className="py-3 px-4 border-b">
                                        <span className={`inline-block px-3 py-1 text-[10px] font-bold text-white rounded-full uppercase ${getStatusColor(order?.status)}`}>
                                            {order?.status || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b text-sm">
                                        {order?.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        <div className="flex items-center justify-center space-x-2">
                                            {/* View Button */}
                                            {/* <Link
                                                to={`/orders/views-pdf`}
                                                className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 text-xs font-medium"
                                            >
                                                <i className="ri-eye-line"></i> View
                                            </Link> */}
                                            <button
                                                onClick={() => generateInvoice(order)} // এখানে 'order' হলো লুপ থেকে পাওয়া সিঙ্গেল ডাটা
                                                className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 text-xs font-medium"
                                            >
                                                <i className="ri-eye-line"></i> View Invoice
                                            </button>

                                            {/* Edit Button */}
                                            <button
                                                onClick={() => handleEdit(order)}
                                                className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-600 hover:text-white transition-all duration-200 text-xs font-medium"
                                            >
                                                <i className="ri-edit-line"></i> Edit
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteClick(order?._id)}
                                                className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-600 hover:text-white transition-all duration-200 text-xs font-medium"
                                            >
                                                <i className="ri-delete-bin-line"></i> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500 italic">
                                    {searchTerm ? `No orders match "${searchTerm}"` : "No orders found!"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedOrder && (
                <UpdateOrderModal
                    order={selectedOrder}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </section>
    )
}

const getStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
        case 'pending': return 'bg-amber-500';
        case 'processing': return 'bg-blue-500';
        case 'shipped': return 'bg-indigo-600';
        case 'completed': return 'bg-green-600';
        case 'delivered': return 'bg-emerald-500';
        case 'cancelled': return 'bg-red-500';
        default: return 'bg-gray-400';
    }
};

export default ManageOrders;