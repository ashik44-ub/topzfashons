import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from "./features/auth/authSlice";
import authApi from "./features/auth/authApi";
import productApi from "./features/products/productsApi"; // নিশ্চিত করুন ফাইলের নাম productsApi ই
import reviewsApi from "./features/reviews/reviewsApi";
import cartReducer from './features/cart/CartSlice';
import wishlistReducer from './features/wishlistSlice/wishlistSlice';
import statsApi from "./features/stats/statsApi";
import orderApi from "./features/orders/orderApi";
import { couponApi } from './features/coupons/couponApi';
import timerReducer from './features/timer/timerSlice';

const cartPersistConfig = {
    key: 'cart',
    storage,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

// সব API Middleware একসাথে একটি অ্যারেতে রাখা ভালো
const apiMiddlewares = [
    authApi.middleware,
    productApi.middleware,
    reviewsApi.middleware,
    statsApi.middleware,
    orderApi.middleware,
    couponApi.middleware
];

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [reviewsApi.reducerPath]: reviewsApi.reducer,
        [statsApi.reducerPath]: statsApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        auth: authReducer,
        wishlist: wishlistReducer,
        cart: persistedCartReducer,
        timer: timerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(...apiMiddlewares), // Spread operator use করে সব middleware অ্যাড করা হলো
});

export const persistor = persistStore(store);