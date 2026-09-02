import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import chatReducer from './chatSlice.js'
import studyMaterialReducer from './studyMaterialSlice.js'
const store=configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        studyMaterial:studyMaterialReducer,
    }
})

export default store;
