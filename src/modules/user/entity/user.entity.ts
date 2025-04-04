import { Field, InputType, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status, UserRole } from "./user.enum";
import { Assets } from "../../Asset/entity/asset.entity";
import { Notifications } from "../../Notification/entity/notification.entity";
import { GraphQLDate } from "graphql-iso-date";

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
    @Field(() => GraphQLDate ,{nullable: true})
    dob?: string;   

    @Column({ type: "varchar", length: 10, nullable: true })
    @Field({ nullable: true})
    gender?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field({ nullable: true})
    blood_group?: string;

    @Column({ type: "varchar", length: 10, nullable: true })
    @Field({ nullable: true})
    marital_status?: string;

    @Column({ type: "varchar", length: 10, nullable: true })
    @Field({ nullable: true})
    phone?: string;

    @Column({ type: "text", nullable: true })
    @Field({ nullable: true})
    address?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field({ nullable: true})
    designation?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field({ nullable: true})
    department?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field({ nullable: true})
    city?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field({ nullable: true})
    state?: string;

    @Column({ type: "varchar", length: 10, nullable: true })
    @Field({ nullable: true})
    pin_code?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    @Field({ nullable: true})
    country?: string;

    @Column({ type: "enum", enum: Status, default: Status.ACTIVE })
    @Field({ nullable: true})
    status?: Status;

    @CreateDateColumn()
    @Field()
    created_at?: Date;

    @UpdateDateColumn()
    @Field()
    updated_at?: Date;

    @Column({ type: "timestamp", nullable: true })
    @Field({ nullable: true})
    deleted_at?: Date;

    @Column({ default: true })
    @Field()
    reset_password?: boolean;

    @OneToMany(() => Assets, (asset) => asset.assignedTo)
    @Field(() => [Assets], { nullable: true })
    assets?: Assets[];

    @OneToMany(() => Notifications, (notification) => notification.userId)
    @Field(() => [Notifications], { nullable: true})
    notifications?: Notifications[];

}