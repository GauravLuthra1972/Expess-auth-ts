import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @Column()
    title!: string;

    @Column("text")
    content!: string;

    @Column({ type: 'varchar', length: 50, default: "Draft" })
    status!: string; 

    @Column({ type: 'int', default: 0 })
    likes_count!: number;

    @Column({ type: 'int', default: 0 })
    comments_count!: number;

    @Column({ nullable: true })
    attachment!: string;

    @Column({ nullable: true })
    tags!: string; 

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;
    

    
}
