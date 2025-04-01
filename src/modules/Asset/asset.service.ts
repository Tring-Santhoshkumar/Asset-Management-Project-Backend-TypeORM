import { IsNull, Repository } from "typeorm";
import { Assets } from "./entity/asset.entity";
import { Users } from "../user/entity/user.entity";
import dataSource from "../../database/data-source";
import dotenv from "dotenv";
import { sendEmail } from "../../utils/mailer/mailer";
import { AssignedStatus } from "./entity/asset.enum";

dotenv.config();

export class AssetService {
    private assetRepository: Repository<Assets>;
    private userRepository: Repository<Users>;

    constructor() {
        this.assetRepository = dataSource.getRepository(Assets);
        this.userRepository = dataSource.getRepository(Users);
    }

    async getAllAssets() {
        return await this.assetRepository.find({ where: { deleted_at:  IsNull() } });
    }

    async getAssetById(id: string) {
        return await this.assetRepository.findOne({ where: { id, deleted_at:  IsNull() } });
    }

    async getAssetsByUserId(userId: string) {
        return await this.assetRepository.find({ where: { assigned_to: userId, deleted_at:  IsNull() } });
    }

    async assignAsset(id: string, assigned_to: string) {
        const asset = await this.assetRepository.findOne({ where: { id } });
        if (!asset) throw new Error("Asset not found");

        asset.assigned_to = assigned_to;
        asset.assigned_status = AssignedStatus.ASSIGNED;
        asset.assigned_date = new Date();
        await this.assetRepository.save(asset);

        const user = await this.userRepository.findOne({ where: { id: assigned_to } });

        if (user) {
            await sendEmail({
                to: user.email,
                subject: "Asset Assigned!!!",
                html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #0056b3;">Asset Assigned to You</h2>
                    <p>Dear ${user.name},</p>
                    <p>A new asset has been assigned to you.</p>
                    <h3>Asset Details:</h3>
                    <p><strong>Type:</strong> ${asset.type}</p>
                    <p><strong>Name:</strong> ${asset.name}</p>
                    <p><strong>Assigned Date:</strong> ${asset.assigned_date}</p>
                    <p>Please ensure proper usage and care of this asset.</p>
                    <hr />
                    <p>Best regards,</p>
                    <p><strong>Tringapps Research Labs Pvt Ltd</strong></p>
                    <p>Email: <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a></p>
                </div>`
            });
        }

        return asset;
    }
}

export const assetService = new AssetService();
