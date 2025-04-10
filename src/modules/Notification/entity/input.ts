import { Field, Int, ObjectType } from "type-graphql";
import { Notifications } from "./notification.entity";

@ObjectType()
export class PaginatedNotifications {
    @Field(() => [Notifications])
    notifications?: Notifications[];
    
    @Field(() => Int)
    totalCount?: number;
}
