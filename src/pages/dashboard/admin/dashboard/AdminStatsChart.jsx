import React from 'react'
import { Pie, Line } from "react-chartjs-2";
import 'chart.js/auto'

const AdminStatsChart = ({ stats }) => {

    // Pie chart data with a softer color palette
    const pieData = {
        labels: ['Orders', 'Products', 'Reviews', 'Users'],
        datasets: [
            {
                label: 'Summary',
                data: [
                    stats?.totalOrders || 0,
                    stats?.totalProducts || 0,
                    stats?.totalReviews || 0,
                    stats?.totalUsers || 0,
                ],
                backgroundColor: [
                    '#6366f1', // Indigo
                    '#10b981', // Emerald
                    '#f59e0b', // Amber
                    '#3b82f6', // Blue
                ],
                hoverOffset: 10,
                borderWidth: 0,
            }
        ]
    }

    // Line chart data processing
    const monthlyData = new Array(12).fill(0);
    stats?.monthlyEarnings?.forEach(entry => {
        monthlyData[entry.month - 1] = entry.earnings
    })

    const lineData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: 'Monthly Earnings ($)',
                data: monthlyData,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)', // Light blue area fill
                borderColor: '#3b82f6',
                borderWidth: 2,
                tension: 0.4, // Makes the line smooth/curvy
                pointBackgroundColor: '#3b82f6',
            }
        ] 
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 12 }
                }
            }
        }
    }

    return (
        <div className='mt-12 space-y-8 pb-10'>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Overview</h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                
                {/* Pie Chart Card */}
                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                    <h3 className='text-lg font-semibold text-gray-700 mb-6'>Orders & Inventory Distribution</h3>
                    <div className='h-80 w-full'>
                        <Pie data={pieData} options={options} />
                    </div>
                </div>

                {/* Line Chart Card */}
                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                    <h3 className='text-lg font-semibold text-gray-700 mb-6'>Earnings Growth (Annual)</h3>
                    <div className='h-80 w-full'>
                        <Line data={lineData} options={options}/>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AdminStatsChart