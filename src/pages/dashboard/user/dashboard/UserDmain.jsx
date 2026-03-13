import React from 'react'
import { useSelector } from 'react-redux'
import { useGetUserStatsQuery } from '../../../../redux/features/stats/statsApi';
import Loading from '../../../../components/Loading';
import UserStats from './UserStats';
import { Bar } from "react-chartjs-2"

import {
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    LogarithmicScale, // <--- Add this
    BarElement, 
    Title, 
    Tooltip, 
    Legend
} from "chart.js"

// ১. Register LogarithmicScale
ChartJS.register(CategoryScale, LinearScale, LogarithmicScale, BarElement, Title, Tooltip, Legend)

const UserDMain = () => {
    const { user } = useSelector((state) => state.auth);
    const userEmail = user?.email;

    const { data: userData, isLoading, error } = useGetUserStatsQuery(userEmail, {
        skip: !userEmail, 
    });

    if (isLoading) return <Loading />;
    if (!userEmail) return <div className="p-5 text-red-500 font-bold text-center">Please login to view dashboard.</div>;
    if (error) return <div className="p-5 text-red-500 font-bold text-center">Failed to load stats.</div>;

    const stats = userData?.data || {};

    const { 
        totalPayments = 0, 
        totalpurchaseProducts = 0, 
        totalReviews = 0 
    } = stats;

    const data = {
        labels: ['Total Payment', 'Total Reviews', 'Total Purchased Products'],
        datasets: [
            {
                label: 'User Activity Stats',
                data: [totalPayments, totalReviews, totalpurchaseProducts],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)', 
                    'rgba(54, 162, 235, 0.7)', 
                    'rgba(75, 192, 192, 0.7)'  
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        if (tooltipItem.label === 'Total Payment') {
                            return `Total Payments: $${Number(tooltipItem.raw).toFixed(2)}`;
                        }
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'logarithmic', // <--- This fixes your issue!
                beginAtZero: true,
                min: 0,
                ticks: {
                    callback: function (value) {
                        // Graph-e scale values gulo manually handle kora (1, 10, 100, 1000, 10000 style)
                        return value;
                    }
                }
            }
        }
    }

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className="mb-8">
                <h1 className='text-3xl font-bold text-gray-800'>User Dashboard</h1>
                <p className='text-gray-500 mt-1'>
                    Hi, <span className="font-semibold text-orange-500">{user?.username || 'User'}</span>! Welcome back.
                </p>
            </div>

            <UserStats stats={stats} />

            <div className='mt-10 bg-white p-6 shadow-md rounded-xl border border-gray-100'>
                <h2 className="text-xl font-semibold mb-6 text-gray-700">Analytics Overview (Scale optimized)</h2>
                <div style={{ height: '450px' }}> 
                    <Bar data={data} options={options} />
                </div>
            </div>
        </div>
    )
}

export default UserDMain;