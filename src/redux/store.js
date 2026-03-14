import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage-e save korbe

import authReducer from "./features/auth/authSlice";
import authApi from "./features/auth/authApi";
import productApi from "./features/products/productsApi";
import reviewsApi from "./features/reviews/reviewsApi";
import cartReducer from './features/cart/CartSlice';
import wishlistReducer from './features/wishlistSlice/wishlistSlice';
import statsApi from "./features/stats/statsApi";
import orderApi from "./features/orders/orderApi";
import { couponApi } from './features/coupons/couponApi';
import timerReducer from './features/timer/timerSlice';
// 1. Persist Config: Shudhu 'cart' ke save korbo
const cartPersistConfig = {
    key: 'cart',
    storage,
};

// 2. Persisted Reducer banano
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
        wishlist: wishlistReducer,
        [productApi.reducerPath]: productApi.reducer,
        [reviewsApi.reducerPath]: reviewsApi.reducer,
        [statsApi.reducerPath]:statsApi.reducer,
        [orderApi.reducerPath]:orderApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        cart: persistedCartReducer, // Ekhane persistedReducer-ta use korlam
        timer: timerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Redux Persist-er jonno serializable check ignore korte hoy
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(authApi.middleware, productApi.middleware, reviewsApi.middleware, statsApi.middleware, orderApi.middleware, couponApi.middleware),
});

export const persistor = persistStore(store);