import { Category } from "src/modules/categories/category.entity";
import { User } from "src/modules/users/user.entity";
import { Comment } from "src/modules/comment/comment.entity";
import { Point } from 'geojson';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Purchase } from "src/modules/purchases/purchase.entity";

@Entity({ name: 'events' })
export class Event {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Index({ spatial: true })
    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: false
    })
    position: Point;

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category[];

    @ManyToOne(() => User, user => user.events)
    user: User;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    startDate?: Date;

    @Column({ nullable: true })
    endDate?: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created: Date;

    @Column({ nullable: true })
    price: number

    @Column({ nullable: true })
    ticketLimit: number

    @Column({ default: 0 })
    ticketsSold: number

    @OneToMany(() => Purchase, (purchase) => purchase.event)
    purchases: Purchase[]

}