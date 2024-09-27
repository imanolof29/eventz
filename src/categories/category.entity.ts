import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'categories' })
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

}
