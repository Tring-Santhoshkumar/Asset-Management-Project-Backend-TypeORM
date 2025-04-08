import { Assets } from "../../Asset/entity/asset.entity";
import { Users } from "../../user/entity/user.entity";
import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";

@Entity()
@ObjectType()
export class Notifications {
    @PrimaryGeneratedColumn("uuid")
    @Field()
    id!: string;

    @Column("text")
    @Field()
    message!: string;

    @Column({ default: false })
    @Field()
    is_read?: boolean;

    @Column({ default: false })
    @Field()
    approved?: boolean;

    @Column({ default: false })
    @Field()
    rejected?: boolean;

    @CreateDateColumn()
    @Field()
    created_at?: Date;

    @ManyToOne(() => Users, (user) => user.notifications, { onDelete: "CASCADE"})
    @JoinColumn({ name: "user_id" })
    @Field(() => Users)
    userId?: Users;
    
    @ManyToOne(() => Assets, (asset) => asset.notifications, { onDelete: "CASCADE" })
    @JoinColumn({ name: "asset_id" })
    @Field(() => Assets)
    assetId?: Assets;

    @ManyToOne(() => Assets,(asset) => asset.exChangeNotifications, { onDelete: "CASCADE" })
    @JoinColumn({ name: "exchange_asset_id" })
    @Field(() => Assets, { nullable: true })
    exchangeAssetId?: Assets;
    
}
