import { InputType, Field } from "type-graphql";
import { AssetCondition, AssignedStatus } from "./asset.enum";

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
    specificaions!: string;

    @Field(() => String)
    condition!: AssetCondition;

    @Field(() => String)
    assigned_status!: AssignedStatus;
}
