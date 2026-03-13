import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../../../../components/Loading';
import TimeLineStep from '../../../../components/TimeLineStep';
import { useGetOrderByIdQuery } from '../../../../redux/features/orders/orderApi';

const steps = [
    {
        status: 'pending',
        label: 'Pending',
        description: 'Your order has been created.',
        icon: { iconName: 'edit-2-line', bgColor: 'bg-red-500', textColor: 'text-white' },
    },
    {
        status: 'processing',
        label: 'Processing',
        description: 'Your order is currently being processed.',
        icon: { iconName: 'loader-line', bgColor: 'bg-yellow-500', textColor: 'text-white' },
    },
    {
        status: 'shipped',
        label: 'Shipped',
        description: 'Your order has been shipped.',
        icon: { iconName: 'truck-line', bgColor: 'bg-blue-800', textColor: 'text-white' },
    },
    {
        status: 'completed',
        label: 'Completed',
        description: 'Your order has been successfully completed.',
        icon: { iconName: 'check-line', bgColor: 'bg-green-800', textColor: 'text-white' },
    },
    {
        status: 'canceled',
        label: 'Canceled',
        description: 'Your order has been Completely Canceled.',
        icon: { iconName: 'close-line', bgColor: 'bg-red-800', textColor: 'text-white' },
    }
];

const OrderDetails = () => {
    const { orderId } = useParams();

    // RTK Query Hook
    const { data, isLoading, error } = useGetOrderByIdQuery(orderId);

    // ডাটা হ্যান্ডলিং
    const order = data?.order || data || {};

    // ডাটা লোডিং বা এরর হ্যান্ডলিং
    if (isLoading) return <Loading />;
    if (error) return <div className="p-5 text-red-500 text-center">Order Data Fetch Failed!</div>;
    if (!data) return <div className="p-5 text-gray-500 text-center">No Order Found.</div>;

    // --- ডায়নামিক স্টেপস ফিল্টারিং লজিক ---
    // যদি অর্ডার স্ট্যাটাস 'canceled' না হয়, তবে 'canceled' স্টেপটি দেখাবে না।
    // আবার যদি অর্ডার 'canceled' হয়, তবে 'completed' স্টেপটি দেখানোর প্রয়োজন নেই।
    const displaySteps = steps.filter(step => {
        const currentStatus = order?.status?.toLowerCase();

        if (currentStatus === 'canceled') {
            // যদি ক্যানসেল হয়, তবে 'completed' বাদ দিয়ে বাকি সব দেখাবে
            return step.status !== 'completed';
        } else {
            // যদি ক্যানসেল না হয়, তবে 'canceled' বাদ দিয়ে বাকি সব দেখাবে
            return step.status !== 'canceled';
        }
    });

    const isCompleted = (status) => {
        const statuses = ["pending", "processing", "shipped", "completed"];
        if (!order?.status) return false;

        const currentStatus = order.status.toLowerCase();
        if (currentStatus === 'canceled' && status === 'pending') return true; // Canceled হলেও pending তো হয়েছেই

        return statuses.indexOf(status) < statuses.indexOf(currentStatus);
    }

    const isCurrent = (status) => order?.status?.toLowerCase() === status.toLowerCase();

    return (
        <div className='section__container rounded p-6 bg-white shadow-md my-10'>
            {/* Order Header Information */}
            <h2 className='text-2xl font-semibold mb-4'>Order Status:
                <span className={`capitalize ml-2 ${order?.status === 'canceled' ? 'text-red-600' : 'text-red-600'}`}>
                    {order?.status || 'Unknown'}
                </span>
            </h2>
            <p className='mb-2 text-gray-600 font-bold'>Transaction ID:
                <span className='text-red-600 font-bold ml-2'>
                    {order?.transactionId || 'N/A'}
                </span>
            </p>
            <p className='mb-8 text-gray-600 font-bold'>Total Amount:
                <span className='text-red-600 font-bold ml-2'>
                    ${Number(order?.amount || 0).toLocaleString()}
                </span>
            </p>

            {/* Timeline View */}
            <ol className='sm:flex items-center relative justify-between w-full'>
                {displaySteps.map((step, index) => (
                    <TimeLineStep
                        key={index}
                        step={step}
                        order={order}
                        isCompleted={isCompleted(step.status)}
                        isCurrent={isCurrent(step.status)}
                        isLastStep={index === displaySteps.length - 1}
                        icon={step.icon}
                        description={step.description}
                    />
                ))}
            </ol>
        </div>
    )
}

export default OrderDetails;