import { Repository } from "typeorm";
import { Notifications } from "./entity/notification.entity";
import { Users } from "../user/entity/user.entity";
import { Assets } from "../Asset/entity/asset.entity";
import dataSource from "../../database/data-source";
import { sendEmail } from "../../utils/mailer/mailer";
import { AssignedStatus } from "../Asset/entity/asset.enum";

export class NotificationService {

    private notificationRepository: Repository<Notifications>;
    private userRepository: Repository<Users>;
    private assetRepository: Repository<Assets>;

    constructor() {
        
        this.notificationRepository = dataSource.getRepository(Notifications);
        this.userRepository = dataSource.getRepository(Users);
        this.assetRepository = dataSource.getRepository(Assets);
    }

    async getAllNotifications() {
        return await this.notificationRepository.find({
            order: { created_at: "DESC" },
            relations: ["user", "asset"]
        });
    }

    async getAllNotificationsById(user_id: string) {
        return await this.notificationRepository.find({
            where: { userId: { id: user_id }},
            order: { created_at: "DESC" },
            relations: ["user", "asset"]
        });
    }

    async getCreateNotification(user_id: string, asset_id: string, message: string) {
        const user = await this.userRepository.findOne({ where: { id: user_id } });
        const asset = await this.assetRepository.findOne({ where: { id: asset_id } });
    
        if (!user || !asset) {
            throw new Error("User or Asset not found");
        }
        const notification = this.notificationRepository.create({ userId: user, assetId: asset, message });
        return await this.notificationRepository.save(notification);
    }

    async getReadNotifications(id: string, choice: boolean) {
        const notification = await this.notificationRepository.findOne({
            where: { id },
            relations: ["user", "asset"]
        });
        if (!notification) throw new Error("Notification not found");
        if (choice) {
            const asset = await this.assetRepository.findOne({ where: { id: notification.assetId?.id } });
            if (!asset) throw new Error("Asset not found");
            asset.assignedTo = notification.userId;
            asset.assigned_status = AssignedStatus.ASSIGNED;
            asset.assigned_date = new Date();
            await this.assetRepository.save(asset);
            notification.is_read = true;
            notification.approved = true;
            await this.notificationRepository.save(notification);
            const user = await this.userRepository.findOne({ where: { id: notification.userId?.id } });
            if (user) {
                await sendEmail({
                    to: user.email,
                    subject: 'Your Requested Asset Assigned Successfully!',
                    html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #28a745;">Asset Request Approved</h2>
                    <p>Dear ${user.name},</p>
                    <p>We are pleased to inform you that your requested asset has been successfully assigned to you.</p>
                    <h3>Asset Details:</h3>
                    <p><strong>Type:</strong> ${asset.type}</p>
                    <p><strong>Name:</strong> ${asset.name}</p>
                    <p><strong>Assigned Date:</strong> ${asset.assigned_date}</p>
                    <p>Please ensure proper handling of this asset as per company policies.</p>
                    <hr />
                    <p>Best regards,</p>
                    <p><strong>Tringapps Research Labs Pvt Ltd</strong></p>
                    <p>Email: <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a></p></div>`
                });
            }
            return 'Successfully Approved!';
        } else {
            notification.is_read = true;
            notification.rejected = true;
            await this.notificationRepository.save(notification);
            const user = await this.userRepository.findOne({ where: { id: notification.userId?.id } });
            if (user) {
                await sendEmail({
                    to: user.email,
                    subject: 'Your Request for Asset Not Approved',
                    html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #d9534f;">Asset Request Not Approved</h2>
                    <p>Dear ${user.name},</p>
                    <p>We regret to inform you that your requested asset could not be assigned at this time.</p>
                    <p>We appreciate your understanding.</p><hr />
                    <p>Best regards,</p>
                    <p><strong>Tringapps Research Labs Pvt Ltd</strong></p>
                    <p>Email: <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a></p></div>`
                });
            }
            return 'Successfully Rejected!';
        }
    }
}

export const notificationService = new NotificationService();


