import { Request, Response } from 'express'
import { AppDataSource } from "../config/data-source";
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Comment } from '../entities/Comment';

class commentController {

    async addComment(req: Request, res: Response) {
        const { post_id, user_id, content } = req.body;

        if (!post_id || !user_id || !content) {
            return res.status(400).json({ message: "post_id, user_id and content are required" });
        }

        try {
            const post = await AppDataSource.getRepository(Post).findOneBy({ id: post_id });
            const user = await AppDataSource.getRepository(User).findOneBy({ id: user_id });


            if (!post) return res.status(404).json({ message: "Post not found" });

            if (!user) return res.status(404).json({ message: "User not found" });

            const comment = new Comment();
            comment.post = post;
            comment.user = user;
            comment.content = content;

            await AppDataSource.getRepository(Comment).save(comment);

            post.comments_count += 1;
            await AppDataSource.getRepository(Post).save(post);

            const { password, ...noPass } = comment.user;
            comment.user = noPass as any;

            return res.status(201).json(comment);
        } catch (error) {
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    async getComments(req: Request, res: Response) {
        const post_id = req.query.post_id;

        if (!post_id) {
            return res.status(400).json({ message: "post_id is required" });
        }

        try {
            const comments = await AppDataSource.getRepository(Comment).find({
                where: { post: { id: Number(post_id) } },
                relations: ["user"],
                order: { created_at: "ASC" }
            });

            for (const comment of comments) {
                const { password, ...userWithoutPassword } = comment.user;
                comment.user = userWithoutPassword as any;
            }


            return res.status(200).json(comments);
        } catch (error) {
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    async deleteComment(req: Request, res: Response) {
        const comment_id = req.query.comment_id;
        if (!comment_id)
            return res.status(400).json({ message: "comment_id is required" });

        try {
            const commentRepo = AppDataSource.getRepository(Comment);
            const comment = await commentRepo.findOne({
                where: { id: Number(comment_id) },
                relations: ["post"]
            });

            if (!comment) return res.status(404).json({ message: "Comment not found" });

            const post = comment.post;
            if (post.comments_count > 0) post.comments_count -= 1;
            await AppDataSource.getRepository(Post).save(post);

            await commentRepo.remove(comment);
            return res.status(200).json({ message: "Comment deleted successfully" });
        } catch {
            return res.status(500).json({ message: "Something went wrong" });
        }
    }



}

export default commentController