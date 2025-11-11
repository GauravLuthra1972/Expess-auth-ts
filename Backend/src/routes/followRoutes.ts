import { Router } from 'express';
import followController from '../controllers/followController';

const router = Router();
const follow=new followController()

router.post("/follow",follow.followUser)
router.post("/unfollow",follow.unfollowUser)
router.get("/getfollowers",follow.getFollowers)
router.get("/getfollowing",follow.getFollowing)


export default router;
