import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import chatReducer from './chatSlice.js'
import studyMaterialReducer from './studyMaterialSlice.js'
import notificationReducer from './notificationSlice.js'
import aiReducer from './aiSlice.js'
const store=configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        studyMaterial:studyMaterialReducer,
        notifications:notificationReducer,
        ai:aiReducer,
    }
})

export default store;
