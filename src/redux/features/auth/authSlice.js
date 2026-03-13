import { createSlice } from '@reduxjs/toolkit';

const loadUserFromLocalStorage = () => {
    try {
        const serializeState = localStorage.getItem('user');
        if (serializeState === null) return {user: null};
        return {user: JSON.parse(serializeState)}
    } catch (error) {
        return {user: null}
    }
}

const initialState = loadUserFromLocalStorage();


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // setUser: (state, action) => {
        //     state.user = action.payload.user;
        //     localStorage.setItem('user', JSON.stringify(state.user))
        // },
        setUser: (state, action) => {
            // যদি পেলোডের ভেতর সরাসরি ইউজার থাকে তবে সেটি নেবে, 
            // নতুবা পেলোডের ভেতর থাকা ইউজার অবজেক্টটি নেবে।
            const userData = action.payload.user ? action.payload.user : action.payload;
            
            state.user = userData;
            localStorage.setItem('user', JSON.stringify(userData));
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user')
        }
    }
})

export const {setUser, logout} = authSlice.actions;
export default authSlice.reducer;