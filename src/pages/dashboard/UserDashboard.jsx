import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useLogoutUserMutation } from '../../redux/features/auth/authApi'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/features/auth/authSlice'

const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/orders", label: "Orders" },
    { path: "/dashboard/payments", label: "Payments" },
    { path: "/dashboard/profile", label: "Profile" },
    { path: "/dashboard/reviews", label: "Reviews" },
]

const UserDashboard = () => {
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            navigate("/")
        } catch (error) {
            console.error("Error to Logout")
        }
    }

    return (
        <div className='bg-white p-5 md:h-screen flex flex-col justify-between border-r border-gray-100 shadow-sm'>
            <div>
                {/* Logo Section */}
                <div className='nav__logo px-4'>
                    <Link to={'/'} className='font-bold text-2xl text-black'>TopZ Fashions</Link>
                    <p className='text-xs italic text-gray-400 tracking-widest'>USER DASHBOARD</p>
                </div>

                <hr className='mt-5 opacity-50' />

                {/* Navigation Links */}
                <ul className='space-y-2 pt-6'>
                    {
                        navItems.map((item, index) => (
                            <li key={index}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === "/dashboard"} // Dashboard home-er jonno end dorkar
                                    className={({ isActive }) =>
                                        `block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${isActive
                                            ? "bg-black text-white shadow-md"
                                            : "text-gray-600 hover:bg-black/10 hover:text-black"
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))
                    }
                </ul>
            </div>

            {/* Logout Button Section */}
            <button
                onClick={handleLogout}
                className='w-full flex items-center justify-center gap-2 text-gray-600 font-bold py-3 rounded-xl transition-all duration-300 group shadow-lg shadow-gray-200 hover:shadow-red-200'
            >
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
            </button>
        </div>
    )
}

export default UserDashboard