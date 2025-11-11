import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Follow } from "../entities/Follow";

class followController {


    async followUser(req: Request, res: Response) {
        const followRepo = AppDataSource.getRepository(Follow);
    const userRepo = AppDataSource.getRepository(User);

        const { followerId, followingId } = req.query


        if (!followerId || !followingId) {
            return res.status(400).json({ message: "Missing followerId or followingId" });

        }

        const follower = await userRepo.findOne({ where: { id: Number(followerId) } });
        const following = await userRepo.findOne({ where: { id: Number(followingId) } });
        console.log("phase1")


        if (!follower || !following) {
            return res.status(404).json({ message: "User not found" });

        }
        console.log("phase2")

        const existing = await followRepo.findOne({
            where: { follower: { id: follower.id }, following: { id: following.id } }
        });

        if (existing) {
            return res.status(400).json({ message: "Already following" });
        }

        const follow = followRepo.create({ follower, following })
        followRepo.save(follow)

        res.json({ message: "Followed successfully" });

    }


    async unfollowUser(req: Request, res: Response) {
        const followRepo = AppDataSource.getRepository(Follow);
    const userRepo = AppDataSource.getRepository(User);
        const { followerId, followingId } = req.query;

        if (!followerId || !followingId)
            return res.status(400).json({ message: "Missing followerId or followingId" });

        const follow = await followRepo.findOne({
            where: {
                follower: { id: Number(followerId) },
                following: { id: Number(followingId) }
            }
        });

        if (!follow)
            return res.status(404).json({ message: "Not following" });

        await followRepo.remove(follow);
        res.json({ message: "Unfollowed successfully" });
    }

    async getFollowing(req: Request, res: Response) {
        const followRepo = AppDataSource.getRepository(Follow);

        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: "Missing userId" });

        const following = await followRepo.find({
            where: { follower: { id: Number(userId) } },
            relations: ["following"]
        });

        res.json(following.map(f => f.following));
    }


    async getFollowers(req: Request, res: Response) {

        const followRepo = AppDataSource.getRepository(Follow);

        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: "Missing userId" });

        const followers = await followRepo.find({
            where: { following: { id: Number(userId) } },
            relations: ["follower"]
        });

        res.json(followers.map(f => f.follower));
    }



}


export default followController