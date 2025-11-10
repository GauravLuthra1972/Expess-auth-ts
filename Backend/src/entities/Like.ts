import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn,Column,Unique } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity("likes")
@Unique(["user", "post"]) 
export class Like {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Post, post => post.likes, { onDelete: "CASCADE" })
    @JoinColumn({ name: "post_id" })
    post!: Post;

    @ManyToOne(() => User, user => user.likes, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;
}
