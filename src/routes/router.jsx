import { createBrowserRouter } from 'react-router-dom'
import App from '../App';
import HomePage from '../pages/home/HomePage';
import ShopPage from '../pages/shop/ShopPage';
import CategoryPage from '../pages/category/CategoryPage';
import ErrorPage from '../components/ErrorPage';
import LoginPage from '../components/LoginPage';
import Register from '../components/Register';
import SingleProduct from '../pages/shop/productDetails/SingleProduct';
import CartModal from '../pages/shop/CartModal';
import PaymentSuccess from '../pages/order/PaymentSuccess';
import PaymentFail from '../pages/order/PaymentFail';
import Checkout from '../pages/shop/checkout/Checkout';
import Wishlist from '../pages/wishlist/Wishlist';
import PrivateRoute from './PrivateRoute';
import UserDmain from '../pages/dashboard/user/dashboard/UserDmain';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import AdminDMain from '../pages/dashboard/admin/dashboard/AdminDMain';
import UserOrders from '../pages/dashboard/user/orders/UserOrders';
import UserPayments from '../pages/dashboard/user/payments/UserPayments';
import UserProfile from '../pages/dashboard/user/profile/UserProfile';
import UserReviews from '../pages/dashboard/user/reviews/UserReviews';
import AddProduct from '../pages/dashboard/admin/addproduct/AddProduct';
import ManageProducts from '../pages/dashboard/admin/manageproducts/ManageProducts';
import UpdateProduct from '../pages/dashboard/admin/manageproducts/UpdateProduct';
import ManageOrders from '../pages/dashboard/admin/orders/ManageOrders';
import ManageUsers from '../pages/dashboard/admin/users/ManageUsers';
import AboutUs from '../components/extra/AboutUs';
import ContactUs from '../components/extra/ContactUs';
import FAQ from '../components/extra/Faq';
import WhoWeAre from '../components/extra/WhoWeAre';
import OrderDetails from '../pages/dashboard/user/orders/OrderDetails';
import Coupon from '../pages/dashboard/admin/coupon/Coupon';
import Otp from '../components/Otp';
import ForgetPassword from '../components/forgetpassword/ForgetPassword';
import TermsConditions from '../pages/termsconditon/TermsConditions';
import ProductSearch from '../components/search/ProductSearch';
import Deals from '../pages/dashboard/admin/beastdeals/Deals';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <HomePage />
            },
            {
                path: '/shop',
                element: <ShopPage />
            },
            {
                path: '/shop/:id',
                element: <SingleProduct />
            },
            {
                path: '/categories/:categoryName',
                element: <CategoryPage />
            },
            {
                path: "/payment/success/:tranId",
                element: <PaymentSuccess />
            },
            {
                path: "/payment/fail/:tranId",
                element: <PaymentFail />
            },
            {
                path: '/orders/:orderId',
                element: <OrderDetails />
            },
            {
                path: '/cart',
                element: <CartModal />
            },
            {
                path: '/checkout',
                element: <Checkout />
            },
            {
                path: '/wishlist',
                element: <Wishlist />
            },
            {
                path: '/about-us',
                element: <AboutUs />
            },
            {
                path: '/contact-us',
                element: <ContactUs />
            },
            {
                path: '/faq',
                element: <FAQ />
            },
            {
                path: '/whoweare',
                element: <WhoWeAre />
            },
            {
                path: '/terms-conditions',
                element: <TermsConditions />
            },
            {
                path: '/search',
                element: <ProductSearch />
            }
        ]
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/verify-otp',
        element: <Otp />
    },
    {
        path: '/forget-password',
        element: <ForgetPassword />
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            // user routes
            {
                path: '',
                element: <UserDmain />
            },
            {
                path: 'orders',
                element: <UserOrders />
            },
            {
                path: 'payments',
                element: <UserPayments />
            },
            {
                path: 'profile',
                element: <UserProfile />
            },
            {
                path: 'reviews',
                element: <UserReviews />
            },

            // admin routes
            {
                path: 'admin',
                element: <PrivateRoute role="admin"><AdminDMain /></PrivateRoute>
            },
            {
                path: 'add-product',
                element: <PrivateRoute role="admin"><AddProduct /></PrivateRoute>
            },
            {
                path: 'manage-products',
                element: <PrivateRoute role="admin"><ManageProducts /></PrivateRoute>
            },
            {
                path: 'update-product/:id',
                element: <PrivateRoute role="admin"><UpdateProduct /></PrivateRoute>
            },
            {
                path: 'manage-orders',
                element: <PrivateRoute role="admin"><ManageOrders /></PrivateRoute>
            },
            {
                path: 'users',
                element: <PrivateRoute role="admin"><ManageUsers /></PrivateRoute>
            },
            {
                path: 'coupon',
                element: <PrivateRoute role="admin"><Coupon /></PrivateRoute>
            },
            {
                path: 'deals',
                element: <PrivateRoute role="admin"><Deals /></PrivateRoute>
            }
        ]
    }
]);

export default router;