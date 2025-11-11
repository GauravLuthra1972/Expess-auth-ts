import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Follow } from "./Follow";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    profile_pic!: string;

    @Column({ nullable: true })
    cover_img!: string;

    @Column({ default: "user" })
    role!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

@Column({ nullable: true })
  twofaSecret!: string;

  @Column({ default: false })
  isTwofaEnabled!: boolean;

    @OneToMany(() => Post, post => post.user)
    posts!: Post[];

    @OneToMany(() => Comment, comment => comment.user)
    comments!: Comment[];

    @OneToMany(() => Like, like => like.user)
    likes!: Like[];

    @OneToMany(() => Follow, follow => follow.follower)
    following!: Follow[];

    @OneToMany(() => Follow, follow => follow.following)
    followers!: Follow[];
}
