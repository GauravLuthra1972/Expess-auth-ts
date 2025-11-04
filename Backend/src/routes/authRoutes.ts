import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();
const auth=new authController()

router.post("/register",auth.registerUser)
router.post("/login",auth.loginUser)
router.post("/refresh",auth.refreshToken)


export default router;
