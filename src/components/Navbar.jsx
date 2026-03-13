import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo1 from '../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../assets/avatar.png';
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { logout } from '../redux/features/auth/authSlice';
import CartModal from '../pages/shop/CartModal';
import toast from 'react-hot-toast'; // টোস্ট মেসেজের জন্য

const Navbar = () => {
    // Redux States
    const products = useSelector((state) => state.cart.products);
    const wishlistItems = useSelector((state) => state.wishlist?.items || []);
    const wishlistCount = wishlistItems.length;
    const { user } = useSelector((state) => state.auth);

    const [isCartOpen, setIseCartOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Mobile Menu State
    const [isDropDownOpens, setIsDropDownOpens] = useState(false); // User Dropdown State

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // --- Logical Handlers ---

    const handleCartToogle = () => {
        setIseCartOpen(!isCartOpen);
    };

    const handleDropDownToogle = () => {
        setIsDropDownOpens(!isDropDownOpens);
    };

    // Checkout Logic: কার্ট খালি থাকলে রিডাইরেক্ট করবে
    const handleCheckoutRedirect = (e) => {
        e.preventDefault();
        if (products.length > 0) {
            setIsOpen(false); // মোবাইল মেনু খোলা থাকলে বন্ধ করে দিবে
            navigate('/checkout');
        } else {
            toast.error("Your cart is empty! Please add products first.");
            navigate('/shop');
        }
    };

    const [logoutUser] = useLogoutUserMutation();

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            toast.success("Logged Out Successfully");
            navigate('/');
        } catch (error) {
            console.error("Error logging out", error);
        }
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropDownOpens(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Menus Data ---
    const userDropdownMenus = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Profile", path: "/dashboard/profile" },
        { label: "Payments", path: "/dashboard/payments" },
        { label: "Orders", path: "/dashboard/orders" }
    ];

    const adminDropdownMenus = [
        { label: "Dashboard", path: "/dashboard/admin" },
        { label: "Manage Items", path: "/dashboard/manage-products" },
        { label: "All Orders", path: "/dashboard/manage-orders" },
        { label: "Add Products", path: "/dashboard/add-product" },
    ];

    const dropdownmenus = user?.role === "admin" ? [...adminDropdownMenus] : [...userDropdownMenus];

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Women's", href: "/categories/woman" },
        { name: "Men's", href: "/categories/man" },
        { name: "Shop", href: "/shop" },
    ];

    const activeStyle = ({ isActive }) =>
        `relative text-[13px] font-bold uppercase tracking-[2px] transition-colors pb-1 ${isActive ? "text-red-500 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-red-500"
            : "text-gray-900 hover:text-red-500"
        }`;

    return (
        <>
            {/* --- Mobile Off-Canvas Menu --- */}
            <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
                <div className={`absolute left-0 top-0 h-full w-80 bg-white p-8 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex justify-between items-center mb-10">
                        <img src={logo1} alt="Logo" className="h-7" />
                        <button onClick={() => setIsOpen(false)} className="text-3xl text-gray-900"><i className="ri-close-line"></i></button>
                    </div>
                    <nav>
                        <ul className="space-y-6">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <NavLink to={link.href} onClick={() => setIsOpen(false)} className={({ isActive }) => `block text-base font-bold uppercase tracking-widest transition-colors ${isActive ? "text-red-500" : "text-gray-900"}`}>
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                            {/* Mobile Checkout Logic */}
                            <li>
                                <button onClick={handleCheckoutRedirect} className="block text-base font-bold uppercase tracking-widest text-gray-900 hover:text-red-500 transition-colors">
                                    Checkout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* --- Desktop Header --- */}
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-20 lg:h-24">

                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0">
                            <img src={logo1} alt="Logo" className="h-10 lg:h-20" />
                        </Link>

                        {/* Navigation (Desktop) */}
                        <nav className="hidden lg:block">
                            <ul className="flex items-center space-x-10">
                                {navLinks.map((link) => (
                                    <li key={link.name} className="relative group">
                                        <NavLink to={link.href} className={activeStyle}>
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}

                                {/* Pages Dropdown */}
                                <li className="relative group cursor-pointer">
                                    <div className="flex items-center text-[13px] font-bold uppercase tracking-[2px] text-gray-900 group-hover:text-red-500 transition-colors">
                                        Top-Z <i className="ri-arrow-down-s-line ml-1 text-lg"></i>
                                    </div>
                                    <ul className="absolute left-0 top-full pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="bg-neutral-900 py-3 shadow-xl">
                                            <li><Link to="/about-us" className="block px-6 py-2 text-[11px] uppercase tracking-widest text-white hover:text-red-500">About Us</Link></li>
                                            <li><Link to="/contact-us" className="block px-6 py-2 text-[11px] uppercase tracking-widest text-white hover:text-red-500">Contact Us</Link></li>
                                            <li><Link to="/dashboard/orders" className="block px-6 py-2 text-[11px] uppercase tracking-widest text-white hover:text-red-500">Order Tracking</Link></li>
                                            
                                            {/* logic applied here */}
                                            <li>
                                                <button 
                                                    onClick={handleCheckoutRedirect}
                                                    className="w-full text-left block px-6 py-2 text-[11px] uppercase tracking-widest text-white hover:text-red-500 transition-colors"
                                                >
                                                    Go to Checkout
                                                </button>
                                            </li>
                                        </div>
                                    </ul>
                                </li>
                            </ul>
                        </nav>

                        {/* Icons Area */}
                        <div className="flex items-center space-x-6">
                            {user ? (
                                <div ref={dropdownRef} className="relative">
                                    <img
                                        onClick={handleDropDownToogle}
                                        className='size-8 rounded-full cursor-pointer object-cover border-2 border-transparent hover:border-red-500 transition-all duration-300'
                                        src={user?.profileImage || avatar}
                                        alt="User"
                                    />
                                    {isDropDownOpens && (
                                        <div className='absolute right-0 mt-4 p-2 w-52 bg-white border border-gray-100 rounded-xl shadow-2xl z-[100] transform transition-all'>
                                            <ul className='space-y-1'>
                                                {dropdownmenus.map((menu, index) => (
                                                    <li key={index}>
                                                        <Link className='block px-4 py-2.5 text-[14px] font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all' onClick={() => setIsDropDownOpens(false)} to={menu.path}>
                                                            {menu.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                                <li className="pt-1 border-t border-gray-50">
                                                    <button className="w-full text-left px-4 py-2.5 text-[14px] font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all" onClick={handleLogout}>
                                                        Logout
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden xl:flex items-center space-x-4 text-[13px] font-bold uppercase tracking-widest text-gray-800 border-r border-gray-200 pr-6">
                                    <Link to="/login" className="hover:text-red-500 transition-colors">Login</Link>
                                    <span className="text-gray-300 font-light">|</span>
                                    <Link to="/register" className="hover:text-red-500 transition-colors">Register</Link>
                                </div>
                            )}

                            <Link to={'/search'} className="text-2xl text-gray-900 hover:text-red-500 transition-colors"><i className="ri-search-line"></i></Link>
                            
                            <Link to="/wishlist" className="relative text-2xl text-gray-900 hover:text-red-500 transition-colors">
                                <i className="ri-heart-line"></i>
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] text-white font-bold">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <Link to="/cart" className="relative text-2xl text-gray-900 hover:text-red-500 transition-colors">
                                <i className="ri-shopping-bag-line"></i>
                                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] text-white font-bold">
                                    {products?.length || 0}
                                </span>
                            </Link>

                            <button onClick={() => setIsOpen(true)} className="lg:hidden text-2xl text-gray-900"><i className="ri-menu-fill"></i></button>
                        </div>
                    </div>
                </div>
                {isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={handleCartToogle} />}
            </header>
        </>
    );
};

export default Navbar;