import { Router } from 'express';
import UserController from '../controllers/userController';
import { authenticate } from '../middlewares/authenticate';
import uploadProfile from '../config/multer';



const router = Router();
const userController=new UserController()
router.get('/',authenticate,userController.fetchUsers)
router.get("/userinfo",authenticate,userController.userinfo)
router.delete("/delete",authenticate,userController.deleteUser)
router.put("/update",userController.updateUser)
router.post("/profile", uploadProfile.single("image"), userController.profileUpload);
router.delete("/deletebyid/:id",userController.deletebyId)
router.put("/adminupdate",userController.adminUpdateUser)
router.delete("/delete-multiple", userController.deleteMultiple);
export default router;
