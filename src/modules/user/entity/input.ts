import { InputType, Field, ObjectType, Int } from "type-graphql";
import { UserRole, Status } from "./user.enum";
import { Users } from "./user.entity";

@InputType()
export class UpdateUserInput {
    @Field()
    id!: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    email?: string;

    @Field(() => String, { nullable: true })
    role?: UserRole;

    @Field({ nullable: true })
    dob?: Date;

    @Field({ nullable: true })
    gender?: string;

    @Field({ nullable: true })
    blood_group?: string;

    @Field({ nullable: true })
    marital_status?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    address?: string;

    @Field({ nullable: true })
    designation?: string;

    @Field({ nullable: true })
    department?: string;

    @Field({ nullable: true })
    city?: string;

    @Field({ nullable: true })
    state?: string;

    @Field({ nullable: true })
    pin_code?: string;

    @Field({ nullable: true })
    country?: string;

    @Field(() => String, { nullable: true })
    status?: Status;

    @Field({ nullable: true })
    reset_password?: boolean;
}



@ObjectType()
export class PaginatedUsers{
    @Field(() => [Users])
    users?: Users[];

    @Field(() => Int)
    totalCount?: number;
}

