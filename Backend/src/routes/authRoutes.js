import express from 'express'
import {signup,signin,logout,updateProfile,checkAuth,bootstrapAdmin} from '../controllers/auth.controller.js'
import protectRoute from '../middleware/auth.middleware.js'

const router=express.Router()

router.post('/signup',signup)
router.post('/signin',signin)
router.post('/logout',logout)
router.post('/bootstrap-admin',bootstrapAdmin)
router.get('/checkAuth',protectRoute,checkAuth)
router.put('/updateProfile',protectRoute,updateProfile)

export default router;