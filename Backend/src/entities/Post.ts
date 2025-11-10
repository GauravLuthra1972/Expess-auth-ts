import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { Like } from "./Like";

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.posts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;



    @Column("text")
    content!: string;

    @Column({ default: 0 })
    likes_count!: number;

    @Column({ default: 0 })
    comments_count!: number;

    @Column({ nullable: true })
    attachment!: string;

    @Column({ nullable: true })
    tags!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @OneToMany(() => Comment, comment => comment.post)
    comments!: Comment[];

    @OneToMany(() => Like, like => like.post)
    likes!: Like[];
}
