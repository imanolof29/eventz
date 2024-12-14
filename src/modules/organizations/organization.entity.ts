import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Event } from "../events/event.entity";

@Entity({ name: 'organizations' })
export class Organization {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ nullable: true })
    logo: string

    @OneToMany(() => User, user => user.organization)
    employees: User[]

    @OneToMany(() => Event, event => event.organizer)
    events: Event[]

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created: Date;

}