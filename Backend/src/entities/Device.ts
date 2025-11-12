import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity("trusted_devices")
export class TrustedDevice {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.id)
    user!: User;

    @Column()
    deviceFingerprint!: string; 

    @Column()
    deviceName!: string; 

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    trusted_at!: Date;
}
