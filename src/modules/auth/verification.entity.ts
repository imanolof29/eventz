import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Verification {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User)
    user: User

    @Column()
    token: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date

}