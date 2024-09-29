import { Category } from "src/categories/category.entity";
import { User } from "src/users/user.entity";
import { Point } from 'geojson';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'events' })
export class Event {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    description: string

    @Index({ spatial: true })
    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: false
    })
    position: Point

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category[]

    @ManyToOne(() => User, user => user.events)
    user: User

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created: Date

}