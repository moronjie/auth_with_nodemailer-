import { Router } from "express";
import { forgotPassword, resetPassword, signIn, signUp, signOut } from "../controllers/auth.controller";

const router = Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/signout', signOut)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router