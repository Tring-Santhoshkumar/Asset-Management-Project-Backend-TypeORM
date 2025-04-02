import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Notifications } from "./entity/notification.entity";
import { notificationService } from "./notification.service";

@Resolver()
export class NotificationResolver {
    @Query(() => [Notifications])
    async getNotifications() {
        try {
            return await notificationService.getAllNotifications();
        } catch (error : any) {
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