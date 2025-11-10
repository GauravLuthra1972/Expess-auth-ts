import { Router } from 'express';
import commentController from '../controllers/commentController';

const router = Router();
const comment=new commentController()

router.post("/add",comment.addComment)
router.get("/",comment.getComments)
router.delete("/delete",comment.deleteComment)


export default router;
