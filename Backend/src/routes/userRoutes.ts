import { Router } from 'express';
import UserController from '../controllers/userController';
import { authenticate } from '../middlewares/authenticate';


const router = Router();
router.get('/',authenticate,UserController.fetchUsers)
router.get("/userinfo",authenticate,UserController.userinfo)
router.delete("/delete",authenticate,UserController.deleteUser)
router.put("/update",authenticate,UserController.updateUser)

export default router;
