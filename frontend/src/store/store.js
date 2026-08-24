import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import chatReducer from './chatSlice.js'
const store=configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
    }
})

export default store;
