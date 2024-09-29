import { Event } from 'src/events/event.entity'
import { passwordHash } from 'src/utils/password.utility'
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ unique: true })
    email: string

    @Column({ unique: true })
    username: string

    @Column({ nullable: true })
    profileImage: string

    @Column()
    password: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @OneToMany(() => Event, (event) => event.user)
    events: Event[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await passwordHash.cryptPassword(this.password)
    }

}
