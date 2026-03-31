import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'

const initialState = {
    products: [],
    selectedItems: 0,
    totalPrice: 0
}

const calculateCartTotals = (products) => {
    const selectedItems = products.reduce((total, product) => total + product.quantity, 0);
    const totalPrice = products.reduce((total, product) => total + product.quantity * product.price, 0);
    return { selectedItems, totalPrice }
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            // ID এবং Size—দুইটাই চেক করা হচ্ছে
            const isExist = state.products.find(
                product => product._id === action.payload._id && product.size === action.payload.size
            );

            if (!isExist) {
                // নতুন আইটেম হিসেবে পুশ হবে
                state.products.push({ ...action.payload, quantity: 1 });
                
                Swal.fire({
                    title: 'Added!',
                    text: `Product (${action.payload.size}) added to cart`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                // একই ID এবং Size হলে শুধু কোয়ান্টিটি বাড়বে
                isExist.quantity += 1;
                
                Swal.fire({
                    title: 'Updated',
                    text: `Quantity increased for size ${action.payload.size}`,
                    icon: 'info',
                    timer: 1000,
                    showConfirmButton: false
                });
            }

            const totals = calculateCartTotals(state.products);
            state.selectedItems = totals.selectedItems;
            state.totalPrice = totals.totalPrice;
        },

        updateQuantity: (state, action) => {
            const { type, id, size } = action.payload; // Payload থেকে size নেওয়া হচ্ছে
            
            // ID এবং Size মিলিয়ে নির্দিষ্ট প্রোডাক্টটি খোঁজা হচ্ছে
            const product = state.products.find(
                (item) => item._id === id && item.size === size
            );

            if (product) {
                if (type === "increment" && product.quantity < 10) {
                    product.quantity += 1;
                } else if (type === "decrement" && product.quantity > 1) {
                    product.quantity -= 1;
                }
            }

            const totals = calculateCartTotals(state.products);
            state.selectedItems = totals.selectedItems;
            state.totalPrice = totals.totalPrice;
        },

        removeFromCart: (state, action) => {
            const { id, size } = action.payload; // Payload থেকে size নেওয়া হচ্ছে
            
            // ID এবং Size এর বাইরে বাকিগুলো রেখে ফিল্টার করা হচ্ছে
            state.products = state.products.filter(
                product => !(product._id === id && product.size === size)
            );

            const totals = calculateCartTotals(state.products);
            state.selectedItems = totals.selectedItems;
            state.totalPrice = totals.totalPrice;
        },

        clearCart: (state) => {
            state.products = [];
            state.selectedItems = 0;
            state.totalPrice = 0;
        }
    }
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;