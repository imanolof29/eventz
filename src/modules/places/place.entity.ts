import { Column, Entity, Index, OneToMany, Point, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "../comment/comment.entity";

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