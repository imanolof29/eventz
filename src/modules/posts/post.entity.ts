import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Place } from "../places/place.entity";
import { PostLike } from "./post-like.entity";

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

    @OneToMany(() => PostLike, like => like.post)
    likes: PostLike[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date


}