import { Event } from 'src/modules/events/event.entity'
import { Comment } from 'src/modules/comment/comment.entity'
import { passwordHash } from 'src/utils/password.utility'
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Purchase } from 'src/modules/purchases/purchase.entity'
import { DeviceToken } from './deviceToken.entity'
import { Notification } from '../notifications/notification.entity'
import { Organization } from '../organizations/organization.entity'
import { Post } from '../posts/post.entity'

export enum UserRole {
    ADMIN = 'ADMIN',
    ORGANIZER = 'ORGANIZER',
    USER = 'USER'
}

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

    @Column({ nullable: true })
    password: string

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @OneToMany(() => Event, (event) => event.organizer)
    organizedEvents: Event[]

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[]

    @OneToMany(() => Purchase, (purchase) => purchase.buyer)
    purchases: Purchase[]

    @OneToMany(() => DeviceToken, token => token.user, { cascade: true })
    tokens: DeviceToken[]

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[]

    @OneToMany(() => Post, post => post.user)
    posts: Post[]

    @ManyToOne(() => Organization, organization => organization.employees, {
        nullable: true
    })
    organization: Organization

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date | null

    @BeforeInsert()
    async hashPassword() {
        if (!this.password) return
        this.password = await passwordHash.cryptPassword(this.password)
    }

}
