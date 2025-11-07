import { Request, Response } from 'express'
import { AppDataSource } from "../config/data-source";
import { Post } from '../entities/Post';
import { User } from '../entities/User';

class postController {


    async fetchAllPosts(req: Request, res: Response) {
        console.log("fetchAllPosts running");

        try {
            const postRepo = AppDataSource.getRepository(Post);

            const data = await postRepo.createQueryBuilder("post")
                .leftJoinAndSelect("post.user", "user")
                .getMany();

            res.json({ message: "Success", data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch posts', details: err });
        }
    }

    async fetchuserposts(req: Request, res: Response) {
        console.log("fetchPostsByUserQuery running");

        const user_id = req.query.user_id as string;
        console.log("User ID:", user_id);

        if (!user_id) {
            return res.status(400).json({ error: 'user_id query parameter is required' });
        }

        try {
            const postRepo = AppDataSource.getRepository(Post);

            const data = await postRepo.createQueryBuilder("post")
                .leftJoinAndSelect("post.user", "user")
                .where("post.user_id = :user_id", { user_id })
                .getMany();

            res.json({ message: "Success", data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch posts', details: err });
        }
    }

    async addPost(req: Request, res: Response) {
        const { user_id, title, content, status, attachment, tags } = req.body;

        if (!user_id || !title || !content) {
            return res.status(400).json({ error: 'user_id, title, and content are required' });
        }

        try {
            const userRepo = AppDataSource.getRepository(User);
            const postRepo = AppDataSource.getRepository(Post);

            const user = await userRepo.findOneBy({ id: parseInt(user_id) });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const attachmentUrl = req.file?.path
            console.log(attachmentUrl)

            const newPost = postRepo.create({
                user,
                title,
                content,
                status: status || "Draft",
                attachment:attachmentUrl,
                tags
            });

            await postRepo.save(newPost);

            res.status(201).json({ message: 'Post created successfully', data: newPost });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create post', details: err });
        }
    }



}


export default postController