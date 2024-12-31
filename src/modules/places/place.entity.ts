import { Column, Entity, Index, ManyToOne, OneToMany, OneToOne, Point, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "../comment/comment.entity";
import { Organization } from "../organizations/organization.entity";
import { Post } from "../posts/post.entity";

@Entity({ name: 'places' })
export class Place {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ nullable: true })
    description: string

    @OneToMany(() => Comment, (comment) => comment.place)
    comments: Comment[];

    @Index({ spatial: true })
    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: false
    })
    position: Point;

    @OneToOne(() => Organization, (organization) => organization.place, { nullable: true })
    organization: Organization

    @OneToMany(() => Post, (post) => post.place)
    posts: Post[]

    @Column({ nullable: true })
    city: string

    @Column({ nullable: true })
    street: string

    @Column({ nullable: true })
    postcode: string

    @Column({ nullable: true })
    housenumber: string

    @Column({ nullable: true })
    website: string

    @Column({ nullable: true })
    email: string

    @Column({ nullable: true })
    facebook: string

    @Column({ nullable: true })
    instagram: string

    @Column({ nullable: true })
    phone: string

    @Column({ unique: true })
    osmId: string

}