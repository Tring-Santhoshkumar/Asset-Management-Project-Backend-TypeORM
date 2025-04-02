import { IsNull, Repository } from "typeorm";
import { Assets } from "./entity/asset.entity";
import { Users } from "../user/entity/user.entity";
import dataSource from "../../database/data-source";
import dotenv from "dotenv";
import { sendEmail } from "../../utils/mailer/mailer";
import { AssetCondition, AssignedStatus } from "./entity/asset.enum";
import { addAssetInput } from "./entity/input";

dotenv.config();

export class AssetService {

    private assetRepository: Repository<Assets>;
    private userRepository: Repository<Users>;

    constructor() {
        this.assetRepository = dataSource.getRepository(Assets);
        this.userRepository = dataSource.getRepository(Users);
    }

    async getAllAssets() {
        return await this.assetRepository.find({ where: { deleted_at: IsNull() } });
    }

    async getAssetById(id: string) {
        return await this.assetRepository.findOne({ where: { id, deleted_at: IsNull() } });
    }

    async getAssetsByUserId(userId: string) {
        return await this.assetRepository.find({ where: { assignedTo: { id: userId }, deleted_at: IsNull() } });
    }

    async insertAsset() {
        const assets = [
            { type: 'Laptop', serial_no: 'TRL101', name: 'Samsung Galaxy Book', version: '2019', specifications: '16GB RAM, 512GB SSD, Intel i7', condition: AssetCondition.NEW, assigned_status: AssignedStatus.AVAILABLE },
            { type: 'Laptop', serial_no: 'TRL102', name: 'MacBook Pro', version: '2024', specifications: '16GB RAM, 1TB SSD, Apple', condition: AssetCondition.GOOD, assigned_status: AssignedStatus.AVAILABLE },
            { type: 'Laptop', serial_no: 'TRL103', name: 'Samsung Galaxy Book', version: '2019', specifications: '14" FHD, 16GB RAM, 512GB SSD', condition: AssetCondition.GOOD, assigned_status: AssignedStatus.AVAILABLE },
            { type: 'Laptop', serial_no: 'TRL104', name: 'MacBook Pro', version: '2023', specifications: '16GB RAM, 500GB SSD, Apple', condition: AssetCondition.NEW, assigned_status: AssignedStatus.AVAILABLE },
            { type: 'Laptop', serial_no: 'TRL105', name: 'Lenovo Ideapad Slim 3', version: '2023', specifications: 'AMD Ryzen 9, 32GB RAM, 1TB SSD', condition: AssetCondition.NEEDS_REPAIR, assigned_status: AssignedStatus.AVAILABLE },
            { type: 'Phone', serial_no: 'TRL106', name: 'iPhone 14 Pro', version: '2022', specifications: '128GB, Deep Purple', condition: AssetCondition.NEW, assigned_status: AssignedStatus.AVAILABLE },
            { type: 'Phone', serial_no: 'TRL107', name: 'Samsung Galaxy S23', version: '2024', specifications: '256GB, Phantom Black', condition: AssetCondition.NEW, assigned_status: AssignedStatus.AVAILABLE },
            { type: 'Phone', serial_no: 'TRL108', name: 'Google Pixel 7 Pro', version: '2024', specifications: '128GB, Stormy Black', condition: AssetCondition.NEW, assigned_status: AssignedStatus.AVAILABLE },
            { type: 'Tablet', serial_no: 'TRL109', name: 'Samsung Galaxy Tab S8', version: '2024', specifications: '256GB, 12.4" Display, S-Pen', condition: AssetCondition.NEEDS_REPAIR, assigned_status: AssignedStatus.AVAILABLE },
            { type: 'Tablet', serial_no: 'TRL110', name: 'iPad Pro', version: '2023', specifications: 'M2 Chip, 256GB', condition: AssetCondition.DAMAGED, assigned_status: AssignedStatus.AVAILABLE },
        ]
        const addedAsset = this.assetRepository.create(assets);
        return await this.assetRepository.save(addedAsset);
    }

    async assignAsset(id: string, assigned_to: string) {
        try{
            const asset = await this.assetRepository.findOne({ where: { id } });
            if (!asset) throw new Error("Asset not found in assignAsset");
            const user = await this.userRepository.findOne({ where: { id: assigned_to } });
            if (!user) throw new Error("User not found in assignAsset");
            asset.assignedTo = user;
            asset.assigned_status = AssignedStatus.ASSIGNED;
            asset.assigned_date = new Date();
            await this.assetRepository.save(asset);
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
        }catch(error : any){
            throw new Error(`Error in assignAsset Service ${error}`)
        }
    }

    async requestAsset(id: string) {
        await this.assetRepository.findOne({ where: { id } });
        return "Successfully requested asset!";
    }

    async addAsset(input: addAssetInput) {
        try {
            const { type, serial_no, name, version, specificaions, condition, assigned_status } = input
            const newAsset = this.assetRepository.create({ type: type, serial_no: serial_no, name: name, version: version, specifications: specificaions, condition: condition, assigned_status: assigned_status });
            this.assetRepository.save(newAsset);
            return "Asset Added Successfully";
        }
        catch (error: any) {
            throw new Error(`Error in addAsset Service ${error}`);
        }
    }

    async deleteAsset(id: string) {
        try {
            const asset = await this.assetRepository.findOne({ where: { id, assigned_status: AssignedStatus.ASSIGNED } });
            if (!asset){
                throw new Error("Asset not found in deleteAsset");
            }
            const user = await this.userRepository.findOne({ where: { id: asset.assignedTo?.id } });
            if (!user){
                throw new Error("User not found in deleteAsset");
            }
            await this.assetRepository.update(id, { deleted_at: new Date(), assignedTo: null as any, assigned_status: AssignedStatus.AVAILABLE })
            await sendEmail({
                to: user.email,
                subject: `Assigned Asset is removed`,
                html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #d9534f;">Assigned Asset Removed</h2>
                    <p>Dear ${user.name},</p>
                    <p>We want to inform you that an asset previously assigned to you has been removed from the organization.</p>
                    <h3>Asset Details:</h3>
                    <p><strong>Serial Number:</strong> ${asset.serial_no}</p>
                    <p><strong>Type:</strong> ${asset.type}</p>
                    <p><strong>Name:</strong> ${asset.name}</p>
                    <p>If you have any questions regarding this change, please contact the IT department or your administrator.</p>\
                    <hr />
                    <p>Best regards,</p>
                    <p><strong>Tringapps Research Labs Pvt Ltd</strong></p>
                    <p>Email: <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a></p>
                    </div>`
            })
            return 'Asset Deleted Successfully';
        } catch (error: any) {
            throw new Error(`Error in deleteAsset Service ${error}`);
        }
    }

    async deAssignAsset(id: string){
        try{
            const asset = await this.assetRepository.update(id,{ assigned_to: null as any, assigned_status: AssignedStatus.AVAILABLE, assigned_date: null as any, return_date: new Date()});
            return asset.affected ? "Asset De-Assigned Successfully!" : "Invalid asset de-assigning!";
        }catch(error : any){
            throw new Error(`Error in deAssignAsset Service ${error}`);
        }
    }
}

export const assetService = new AssetService();
