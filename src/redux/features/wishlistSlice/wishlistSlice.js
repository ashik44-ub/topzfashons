// import { createSlice } from '@reduxjs/toolkit';
// import toast from 'react-hot-toast';

// const initialState = {
//     items: JSON.parse(localStorage.getItem('wishlist')) || [],
// };

// const wishlistSlice = createSlice({
//     name: 'wishlist',
//     initialState,
//     reducers: {
//         addToWishlist: (state, action) => {
//             const product = action.payload;
//             const isExist = state.items.find((item) => item.id === product.id);

//             if (!isExist) {
//                 state.items.push(product);
//                 localStorage.setItem('wishlist', JSON.stringify(state.items));
//                 toast.success(`${product.name} Added to Wishlist!`);
//             } else {
//                 toast.success("Your Favorite Added to Wishlist!");
//             }
//         },

//         removeFromWishlist: (state, action) => {
//             const productId = action.payload;
//             state.items = state.items.filter((item) => item.id !== productId);
//             localStorage.setItem('wishlist', JSON.stringify(state.items));
//             toast.error("Your Favorite Remove from Wishlist.");
//         },

//         clearWishlist: (state) => {
//             state.items = [];
//             localStorage.removeItem('wishlist');
//         }
//     },
// });

// export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
// export default wishlistSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialState = {
    items: JSON.parse(localStorage.getItem('wishlist')) || [],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const product = action.payload;

            // ডাটা থেকে সঠিক আইডিটি খুঁজে বের করার লজিক
            const productId = product._id || product.id;

            // চেক করা হচ্ছে অলরেডি এই আইডি'র কোনো প্রোডাক্ট আছে কি না
            const isExist = state.items.find((item) => {
                const itemId = item._id || item.id;
                return itemId === productId;
            });

            if (!isExist) {
                state.items.push(product);
                localStorage.setItem('wishlist', JSON.stringify(state.items));
                toast.success(`${product.name} added to wishlist!`);
            } else {
                // অলরেডি থাকলে এই মেসেজটি আসবে
                toast.error("This item is already in your wishlist!");
            }
        },

        removeFromWishlist: (state, action) => {
            const productId = action.payload; // এখান থেকেও _id বা id আসবে
            state.items = state.items.filter((item) => (item._id || item.id) !== productId);
            localStorage.setItem('wishlist', JSON.stringify(state.items));
            toast.error("Removed from wishlist.");
        },

        clearWishlist: (state) => {
            state.items = [];
            localStorage.removeItem('wishlist');
            toast.success("Wishlist cleared!");
        }
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;