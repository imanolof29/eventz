import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Place } from "../places/place.entity";

@Entity({ name: 'posts' })
export class Post {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    photo: string


    @ManyToOne(() => User, (user) => user.posts)
    user: User

    @ManyToOne(() => Place, (place) => place.posts)
    place: Place

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date


}