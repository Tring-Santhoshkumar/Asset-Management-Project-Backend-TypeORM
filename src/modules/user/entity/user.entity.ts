import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status, UserRole } from "./user.enum";
import { Assets } from "../../Asset/entity/asset.entity";
import { Notifications } from "../../Notification/entity/notification.entity";

@Entity('users')
@ObjectType()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    @Field()
    id!: string;

    @Column({ length: 30 })
    @Field()
    name!: string;

    @Column({ length: 100})
    @Field()
    email!: string;

    @Column("text")
    password!: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
    @Field()
    role!: UserRole;

    @Column({ type: "date", nullable: true })
    @Field()
    dob?: Date;

    @Column({ type: "varchar", length: 10, nullable: true })
    @Field()
    gender?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field()
    blood_group?: string;

    @Column({ type: "varchar", length: 10, nullable: true })
    @Field()
    marital_status?: string;

    @Column({ type: "varchar", length: 10, nullable: true })
    @Field()
    phone?: string;

    @Column({ type: "text", nullable: true })
    @Field()
    address?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field()
    designation?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field()
    department?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field()
    city?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field()
    state?: string;

    @Column({ type: "varchar", length: 10, nullable: true })
    @Field()
    pin_code?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field()
    country?: string;

    @Column({ type: "enum", enum: Status, default: Status.ACTIVE })
    @Field()
    status?: Status;

    @CreateDateColumn()
    @Field()
    created_at?: Date;

    @UpdateDateColumn()
    @Field()
    updated_at?: Date;

    @Column({ type: "timestamp", nullable: true })
    @Field()
    deleted_at?: Date;

    @Column({ default: true })
    @Field()
    reset_password?: boolean;

    @OneToMany(() => Assets, (asset) => asset.assigned_to)
    @Field(() => [Assets], { nullable: true })
    assets?: Assets[];

    @OneToMany(() => Notifications, (notification) => notification.userId)
    @Field(() => [Notifications], { nullable: true})
    notifications?: Notifications[];

}