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
            const isExist = state.items.find((item) => item.id === product.id);

            if (!isExist) {
                state.items.push(product);
                localStorage.setItem('wishlist', JSON.stringify(state.items));
                toast.success(`${product.name} Added to Wishlist!`);
            } else {
                toast.success("Your Favorite Added to Wishlist!");
            }
        },

        removeFromWishlist: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter((item) => item.id !== productId);
            localStorage.setItem('wishlist', JSON.stringify(state.items));
            toast.error("Your Favorite Remove from Wishlist.");
        },

        clearWishlist: (state) => {
            state.items = [];
            localStorage.removeItem('wishlist');
        }
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;