import { IsNull, Repository } from "typeorm";
import { Assets } from "./entity/asset.entity";
import { Users } from "../user/entity/user.entity";
import dataSource from "../../database/data-source";
import dotenv from "dotenv";
import { sendEmail } from "../../utils/mailer/mailer";
import { AssetCondition, AssignedStatus } from "./entity/asset.enum";
import { addAssetInput } from "./entity/input";
import { readFile } from "fs/promises";
import path from "path";

dotenv.config();

export class AssetService {

    private assetRepository: Repository<Assets>;
    private userRepository: Repository<Users>;

    constructor() {
        this.assetRepository = dataSource.getRepository(Assets);
        this.userRepository = dataSource.getRepository(Users);
    }

    async getAllAssets() {
        return await this.assetRepository.find({ where: { deleted_at: IsNull() }, relations: ["assignedTo"] });
    }

    async getAllAssetsPagination(page: number, limit: number){
        // const next = (page - 1) * limit;
        const [assets, totalCount] = await this.assetRepository.findAndCount({ where: { deleted_at: IsNull() }, relations: ["assignedTo"], take: limit, skip: (page - 1) * limit });
        return { assets, totalCount };
    }

    async getAssetById(id: string) {
        return await this.assetRepository.findOne({ where: { id, deleted_at: IsNull() }, relations: ["assignedTo"] });
    }

    async getAssetsByUserId(userId: string) {
        return await this.assetRepository.find({ where: { assignedTo: { id: userId }, deleted_at: IsNull() }, relations: ["assignedTo"] });
    }

    async insertAsset() {
        const filePath = path.join(__dirname, 'entity', 'assets.json');
        const data = await readFile(filePath, 'utf-8');
        // console.log('Json',data);
        let assets = JSON.parse(data);
        assets = assets.map((asset: { condition: string; assigned_status: string }) => ({
            ...asset,
            condition: AssetCondition[asset.condition as keyof typeof AssetCondition],
            assigned_status: AssignedStatus[asset.assigned_status as keyof typeof AssignedStatus]
        }));
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

    async addAsset(input: addAssetInput) {
        try {
            const { type, serial_no, name, version, specifications, condition, assigned_status } = input
            const newAsset = this.assetRepository.create({ type: type, serial_no: serial_no, name: name, version: version, specifications: specifications, condition: condition, assigned_status: assigned_status });
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
            if(!asset){
                throw new Error("Asset not found in deleteAsset");
            }
            const user = await this.userRepository.findOne({ where: { id: asset.assignedTo?.id } });
            await this.assetRepository.update(id, { deleted_at: new Date(), assignedTo: null as any, assigned_status: AssignedStatus.AVAILABLE });
            if(user){
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
            }
            return 'Asset Deleted Successfully';
        } catch (error) {
            throw new Error(`Error in deleteAsset Service` + error);
        }
    }

    async deAssignAsset(id: string){
        try{
            const asset = await this.assetRepository.update(id,{ assigned_to: null as any, assigned_status: AssignedStatus.AVAILABLE, assigned_date: null as any, return_date: new Date()});
            return asset.affected ? "Asset De-Assigned Successfully!" : "Invalid asset de-assigning!";
        }catch(error){
            throw new Error(`Error in deAssignAsset Service` + error);
        }
    }
}
export const assetService = new AssetService();
