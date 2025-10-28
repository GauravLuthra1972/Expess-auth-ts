import { Router } from 'express';
import UserController from '../controllers/userController';
import { authenticate } from '../middlewares/authenticate';


const router = Router();
router.get('/',UserController.fetchUsers)
router.post("/register",UserController.registerUser)
router.post("/login",UserController.loginUser)
router.post("/refresh",UserController.refreshToken)
router.post("/userinfo",UserController.userinfo)

export default router;
