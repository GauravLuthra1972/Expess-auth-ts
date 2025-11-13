import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("trustedevices")
export class Device {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE" })
  user!: User;

  @Column()
  deviceFingerprint!: string;

  @Column()
  deviceName!: string;

  @Column()
  tokenHash!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  trusted_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  expires_at!: Date;
}
