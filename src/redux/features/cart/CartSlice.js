import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'

const initialState = {
    products: [],
    selectedItems: 0,
    totalPrice: 0
}

const calculateCartTotals = (products)=> {
    const selectedItems = products.reduce((total, product) => total + product.quantity, 0);
    const totalPrice = products.reduce((total, product)=> total + product.quantity * product.price, 0);
    return { selectedItems, totalPrice }
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // addToCart: (state, action) => {
        //     const isExist = state.products.find(product => product._id === action.payload._id);
            
        //     if (!isExist) {
        //         // Jodi product-ta cart-e na thake, tobe add koro
        //         // Shather 'quantity' initialize kore deya bhalo
        //         state.products.push({ ...action.payload, quantity: 1 });
        //         Swal.fire({
        //         title: 'Added!',
        //         text: 'Product added to cart',
        //         icon: 'success',
        //         confirmButtonText: "it's ok"
        //         })
        //     } else {
        //         // Jodi thake, tahole quantity bariye dao
        //         // isExist.quantity += 1;
        //         Swal.fire({
        //         title: 'Already Added',
        //         text: 'Product already in cart',
        //         icon: 'error',
        //         confirmButtonText: "it's ok"
        //         })
        //     }

        //     // Global totals update koro
        //    const totals = calculateCartTotals(state.products)
        //     state.selectedItems = totals.selectedItems;
        //     state.totalPrice = totals.totalPrice;
        // }

        addToCart: (state, action) => {
    // 1. Check koro ID ebong Size duitai mile kina
    const isExist = state.products.find(
        product => product._id === action.payload._id && product.size === action.payload.size
    );
    
    if (!isExist) {
        // Jodi product + size combination-ta na thake, tobe add koro
        // action.payload-er bhetore 'size' field-ta thakte hobe (Front-end theke pathate hobe)
        state.products.push({ ...action.payload, quantity: 1 });
        
        Swal.fire({
            title: 'Added!',
            text: `Product (${action.payload.size}) added to cart`,
            icon: 'success',
            confirmButtonText: "it's ok"
        });
    } else {
        // Jodi thake, tahole quantity bariye dao (optional)
        isExist.quantity += 1; 
        
        Swal.fire({
            title: 'Updated',
            text: 'Product quantity increased in cart',
            icon: 'info',
            confirmButtonText: "it's ok"
        });
    }

    // Global totals update koro
    const totals = calculateCartTotals(state.products);
    state.selectedItems = totals.selectedItems;
    state.totalPrice = totals.totalPrice;
}
        ,
        clearCart: (state) => {
            state.products = [];
            state.selectedItems = 0;
            state.totalPrice = 0;
        },
        updateQuantity: (state, action)=> {
            const product = state.products.find((item)=> item._id === action.payload.id);
            
            if (product) {
                if(action.payload.type === "increment" && product.quantity < 10){
                    product.quantity += 1;
                }else if(action.payload.type === "decrement" && product.quantity > 1){
                    product.quantity -=1;
                }
            }
            const totals = calculateCartTotals(state.products)
            state.selectedItems = totals.selectedItems;
            state.totalPrice = totals.totalPrice;
        },
        removeFromCart: (state, action)=> {
            state.products = state.products.filter(product => product._id !== action.payload.id);
            const totals = calculateCartTotals(state.products)
            state.selectedItems = totals.selectedItems;
            state.totalPrice = totals.totalPrice;
        },
        clearCart: (state) => {
            // কোলন (:) এর বদলে ডট (.) হবে
            Object.assign(state, initialState);
        }
    }
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;