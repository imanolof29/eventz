import { Category } from "src/categories/category.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, Point, PrimaryGeneratedColumn } from "typeorm";

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
        type: 'point',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: false
    })
    position: Point

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category[]

    @OneToMany(() => User, user => user.id)
    user: User

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created: Date

}