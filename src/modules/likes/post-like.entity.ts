import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Post } from "../posts/post.entity";

@Entity({ name: 'post-likes' })
export class PostLike {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, user => user.likes)
    user: User

    @ManyToOne(() => post => post.likes)
    post: Post

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

}