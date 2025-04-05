import { InputType, Field, ObjectType, Int } from "type-graphql";
import { AssetCondition, AssignedStatus } from "./asset.enum";
import { Assets } from "./asset.entity";

@InputType()
export class addAssetInput {
    @Field()
    type!: string;

    @Field()
    serial_no!: string;

    @Field()
    name!: string;

    @Field()
    version!: string;

    @Field()
    specifications!: string;

    @Field(() => String)
    condition!: AssetCondition;

    @Field(() => String)
    assigned_status!: AssignedStatus;
}



@ObjectType()
export class PaginatedAssets {
    @Field(() => [Assets])
    assets?: Assets[];
    
    @Field(() => Int)
    totalCount?: number;
}