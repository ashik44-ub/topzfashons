import React from 'react'
import { Link, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useLogoutUserMutation } from '../../redux/features/auth/authApi'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/features/auth/authSlice'

const navItems = [
  { path: "/dashboard/admin", label: "Dashboard" },
  { path: "/dashboard/add-product", label: "Add Product" },
  { path: '/dashboard/coupon', label: 'Add Coupon'},
  { path: '/dashboard/deals', label: 'Add Deals'},
  { path: "/dashboard/manage-products", label: "Manage Products" },
  { path: "/dashboard/manage-orders", label: "Manage Orders" },
  { path: "/dashboard/users", label: "Users" },
]

const AdminDashboard = () => {

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
    <div className='space-y-s bg-white p-8 md:h-screen flex flex-col justify-between'>
      <div>
        <div className='nav__logo'>
          <Link to={'/'} className='font-bold text-2xl text-black'>TopZ Fashions</Link>
          <p className='text-xs italic text-gray-400 tracking-widest'>Admin Dashboard</p>
        </div>
        <hr className='mt-5' />
        <ul className='space-y-5 pt-5'>
          {
            navItems.map((item, index) => (
              <li key={index}>
                <NavLink to={item?.path}
                  className={({ isActive }) =>
                                        `block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${isActive
                                            ? "bg-black text-white shadow-md"
                                            : "text-gray-600 hover:bg-black/10 hover:text-black"
                                        }`
                                    }>
                  {
                    item?.label
                  }
                </NavLink>
              </li>
            ))
          }
        </ul>
      </div>
      {/* logout */}
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

export default AdminDashboard