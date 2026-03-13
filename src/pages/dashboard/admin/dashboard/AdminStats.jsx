import React from 'react'

const AdminStats = ({ stats }) => {
    return (
        <div className='my-8'>
            <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                
                {/* Total Earning */}
                <div className='bg-white p-6 rounded-xl border-t-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-300'>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>Total Earning</p>
                    <h2 className='text-2xl font-extrabold text-gray-800'>
                        Tk.{stats?.totalEarings ? Number(stats.totalEarings).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                    </h2>
                    <div className='mt-2 text-xs text-blue-500 font-medium'> All Month</div>
                </div>

                {/* All Orders */}
                <div className='bg-white p-6 rounded-xl border-t-4 border-green-500 shadow-sm hover:shadow-md transition-shadow duration-300'>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>All Orders</p>
                    <h2 className='text-2xl font-extrabold text-gray-800'>{stats?.totalOrders || 0}</h2>
                    <div className='mt-2 text-xs text-green-500 font-medium'>Orders processed</div>
                </div>

                {/* All Users */}
                <div className='bg-white p-6 rounded-xl border-t-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow duration-300'>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>All Users</p>
                    <h2 className='text-2xl font-extrabold text-gray-800'>{stats?.totalUsers || 0}</h2>
                    <div className='mt-2 text-xs text-purple-500 font-medium'>Registered customers</div>
                </div>

                {/* All Reviews */}
                <div className='bg-white p-6 rounded-xl border-t-4 border-yellow-500 shadow-sm hover:shadow-md transition-shadow duration-300'>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>All Reviews</p>
                    <h2 className='text-2xl font-extrabold text-gray-800'>{stats?.totalReviews || 0}</h2>
                    <div className='mt-2 text-xs text-yellow-600 font-medium'>Customer feedback</div>
                </div>

                {/* Total Products */}
                <div className='bg-white p-6 rounded-xl border-t-4 border-red-500 shadow-sm hover:shadow-md transition-shadow duration-300'>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>Total Products</p>
                    <h2 className='text-2xl font-extrabold text-gray-800'>{stats?.totalproducts || 0}</h2>
                    <div className='mt-2 text-xs text-red-500 font-medium'>Active in store</div>
                </div>

            </div>
        </div>
    )
}

export default AdminStats;