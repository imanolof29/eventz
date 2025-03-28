import { Category } from "src/modules/categories/category.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Purchase } from "src/modules/purchases/purchase.entity";
import { Organization } from "../organizations/organization.entity";

@Entity({ name: 'events' })
export class Event {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category[];

    @ManyToOne(() => Organization, organization => organization.events)
    organizer: Organization;

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