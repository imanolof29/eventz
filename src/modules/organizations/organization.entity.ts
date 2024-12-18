import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Event } from "../events/event.entity";
import { Place } from "../places/place.entity";

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

    @OneToOne(() => Place, (place) => place.organization, { nullable: true })
    place: Place

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created: Date;

}