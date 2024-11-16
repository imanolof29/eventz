import { User } from "src/modules/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Place } from "../places/place.entity";

@Entity({ name: 'comments' })
export class Comment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @ManyToOne(() => Place, (place) => place.comments)
    place: Place

}