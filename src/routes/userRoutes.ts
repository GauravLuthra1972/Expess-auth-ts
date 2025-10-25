import { Router } from 'express';
import { fetchUsers,registerUser,loginUser} from '../controllers/userController';

const router = Router();
router.get('/',fetchUsers);
router.post("/register",registerUser)
router.post("/login",loginUser)


export default router;
