import express from 'express'
import {signup,signin,logout,updateProfile,checkAuth,bootstrapAdmin, createUser} from '../controllers/auth.controller.js'
import protectRoute from '../middleware/auth.middleware.js'
import adminOnly from '../middleware/admin.middleware.js'
const router=express.Router()

router.post('/signin',signin)
router.post('/logout',logout)
router.get('/checkAuth',protectRoute,checkAuth)
router.put('/updateProfile',protectRoute,updateProfile)

router.post(
    '/create-user',
    protectRoute,
    adminOnly,
    createUser
);

export default router;