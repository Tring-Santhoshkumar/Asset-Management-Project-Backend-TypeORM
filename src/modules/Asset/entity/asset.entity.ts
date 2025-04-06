import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from "typeorm";
import { Users } from "../../user/entity/user.entity";
import { Field, ObjectType } from "type-graphql";
import { AssetCondition, AssignedStatus } from "./asset.enum";
import { Notifications } from "../../Notification/entity/notification.entity";

@Entity("assets")
@ObjectType()
export class Assets {
    @PrimaryGeneratedColumn("uuid")
    @Field()
    id!: string;

    @Column({ length: 20 })
    @Field()
    serial_no!: string;

    @Column({ length: 50 })
    @Field()
    type!: string;

    @Column({ length: 100 })
    @Field()
    name!: string;

    @Column({ length: 100 })
    @Field()
    version!: string;

    @Column("text")
    @Field()
    specifications!: string;

    @Column({ type: "enum", enum: AssetCondition, default: AssetCondition.NEW })
    @Field()
    condition!: AssetCondition;

    @Column({ type: "int", nullable: true })
    @Field({ nullable: true})
    assigned_to?: number;

    @Column({ type: "enum", enum: AssignedStatus, default: AssignedStatus.AVAILABLE })
    @Field()
    assigned_status?: AssignedStatus;

    @Column({ type: "timestamp", nullable: true })
    @Field({ nullable: true})
    assigned_date?: Date;

    @Column({ type: "timestamp", nullable: true })
    @Field({ nullable: true})
    return_date?: Date;

    @CreateDateColumn()
    @Field()
    created_at?: Date;

    @UpdateDateColumn()
    @Field()
    updated_at?: Date;

    @Column({ type: "timestamp", nullable: true })
    @Field({ nullable: true})
    deleted_at?: Date;

    @ManyToOne(() => Users, (user) => user.assets, { nullable: true})
    @JoinColumn({ name: "assigned_to" })
    @Field(() => Users, { nullable: true })
    assignedTo?: Users;


    @OneToMany(() => Notifications, (notification) => notification.assetId)
    @Field(() => [Notifications], { nullable: true})
    notifications?: Notifications[];


    @OneToMany(() => Notifications, (notification) => notification.exchangeAssetId)
    @Field(() => [Notifications], { nullable: true})
    exChangeNotifications?: Notifications[];
}
