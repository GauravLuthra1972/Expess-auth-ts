import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn,Column } from "typeorm";
import { User } from "./User";

@Entity("follows")
export class Follow {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.following, { onDelete: "CASCADE" })
    @JoinColumn({ name: "follower_id" })
    follower!: User;

    @ManyToOne(() => User, user => user.followers, { onDelete: "CASCADE" })
    @JoinColumn({ name: "following_id" })
    following!: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;
}
