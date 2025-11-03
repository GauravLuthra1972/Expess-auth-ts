import { Router } from 'express';
import UserController from '../controllers/userController';
import { authenticate } from '../middlewares/authenticate';
import uploadProfile from '../config/multer';


const router = Router();
router.get('/',authenticate,UserController.fetchUsers)
router.get("/userinfo",authenticate,UserController.userinfo)
router.delete("/delete",authenticate,UserController.deleteUser)
router.put("/update",UserController.updateUser)
router.post("/profile", uploadProfile.single("image"), UserController.profileUpload);
router.delete("/deletebyid/:id",UserController.deletebyId)
router.put("/adminupdate",UserController.adminUpdateUser)
router.delete("/delete-multiple", UserController.deleteMultiple);
export default router;
