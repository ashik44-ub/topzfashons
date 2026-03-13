import React, { useState } from 'react'
import { useUpdateOrderStatusMutation } from '../../../../redux/features/orders/orderApi';
import toast from 'react-hot-toast';

const UpdateOrderModal = ({order, isOpen, onClose}) => {
    // Modal bondho thakle kichu render korbe na
    if (!isOpen) return null;

    const [status, setStatus] = useState(order?.status);
    const [updateOrderStatus, {isLoading, error}] = useUpdateOrderStatusMutation();

    const handleUpdate = async () => {
        try {
            // Backend-e update request pathano
            await updateOrderStatus({id: order?._id, status}).unwrap();
            toast.success("Order status updated successfully!");
            onClose(); // Success hole modal bondho hobe
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Update Order Status</h2>
                
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Select Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {/* IMPORTANT: Backend Schema-te enum-e jey jey shobdo ache, 
                           sudhu sheguloi value hishebe pathaben. 
                        */}
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option> 
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
                
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
                    <button
                        onClick={handleUpdate}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
                    >
                        {isLoading ? "Updating..." : "Update"}
                    </button>
                </div>

                {/* Error message display */}
                {error && (
                    <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-red-600 text-xs">
                            {error?.data?.message || "Server side validation error (500)"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UpdateOrderModal