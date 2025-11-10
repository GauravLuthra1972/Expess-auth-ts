import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Post, post => post.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "post_id" })
    post!: Post;

    @ManyToOne(() => User, user => user.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @Column("text")
    content!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;
}
