import { Router } from 'express';
import UserController from '../controllers/userController';


const router = Router();
router.get('/',UserController.fetchUsers);
router.post("/register",UserController.registerUser)
router.post("/login",UserController.loginUser)



export default router;
