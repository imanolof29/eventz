import { User } from "src/modules/users/user.entity";
import { Event } from "src/modules/events/event.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'comments' })
export class Comment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @ManyToOne(() => Event, (event) => event.comments)
    event: Event;

}