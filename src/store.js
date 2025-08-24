import { configureStore } from "@reduxjs/toolkit";
import userReducer from './features/User/userSlice'
import cartReducer from './features/Cart1/cartSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer
    }
});

export default store;