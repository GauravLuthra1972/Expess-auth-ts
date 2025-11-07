import { Router } from "express";
import postController from "../controllers/postController";
import uploadPost from "../config/uploadPost";
import { authenticate } from "../middlewares/authenticate";

const router=Router()
const posts=new postController()

router.get("/", authenticate,posts.fetchAllPosts);
router.get("/fetchUser",authenticate,posts.fetchuserposts);

router.post("/add", authenticate,uploadPost.single("attachment"), posts.addPost);
export default router