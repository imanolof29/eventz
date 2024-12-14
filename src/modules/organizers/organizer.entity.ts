import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "../events/event.entity"

@Entity({ name: 'organizer' })
export class Organizer {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @OneToMany(() => Event, (event) => event.organizer)
    events: Event[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

}