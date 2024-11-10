import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'deviceToken' })
export class DeviceToken {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    token: string

    @ManyToOne(() => User, user => user.tokens, { onDelete: 'CASCADE' })
    user: User

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

}