import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Notifications } from "./entity/notification.entity";
import { notificationService } from "./notification.service";
import { PaginatedNotifications } from "./entity/input";

@Resolver()
export class NotificationResolver {
    @Query(() => PaginatedNotifications)
    async getNotifications(
        @Arg("page", () => Int) page: number,
        @Arg("limit", () => Int) limit: number
    ) {
        try {
            return await notificationService.getAllNotifications(page, limit);
        } catch (error : any) {
            throw new Error(error.message);
        }
    }

    @Query(() => [Notifications])
    async getAllNotificationsIcon(){
        try{
            return await notificationService.getAllNotificationsIcon();
        }
        catch(error : any){
            throw new Error(error.message);
        }
    }

    @Query(() => [Notifications], { nullable: true })
    async getNotificationsById(@Arg("user_id") userId: string) {
        try {
            return await notificationService.getAllNotificationsById(userId);
        } catch (error : any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => Notifications)
    async createNotification(
        @Arg("user_id") userId: string,
        @Arg("asset_id") assetId: string,
        @Arg("message") message: string
    ) {
        try {
            return await notificationService.getCreateNotification(userId, assetId, message);
        } 
        catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => String)
    async readNotifications(
        @Arg("id") id: string,
        @Arg("choice") choice: boolean
    ) {
        try {
            return await notificationService.getReadNotifications(id, choice);
        }
         catch (error: any) {
            throw new Error(error.message);
        }
    }
}