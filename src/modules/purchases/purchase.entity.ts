import { User } from "src/modules/users/user.entity";
import { Event } from "src/modules/events/event.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum PurchaseStatus {
    PENDING,
    COMPLETED,
    REFUNDED,
    CANCELLED
}

@Entity({ name: 'purchases' })
export class Purchase {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.purchases)
    buyer: User;

    @ManyToOne(() => Event, event => event.purchases)
    event: Event;

    @Column()
    purchaseDate: Date;

    @Column({
        type: 'enum',
        enum: PurchaseStatus,
        default: PurchaseStatus.PENDING
    })
    status: PurchaseStatus

    @Column({ default: 1 })
    quantity: number;
}