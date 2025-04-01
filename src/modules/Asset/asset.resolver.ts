import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Assets } from "./entity/asset.entity";
import { AssetService } from "./asset.service";



@Resolver()
export class AssetResolver {

    private assetService: AssetService;

    constructor() {
        this.assetService = new AssetService();
    }

    @Query(() => [Assets])
    async allAssets() {
        try {
            return await this.assetService.getAllAssets();
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => Assets, { nullable: true })
    async asset(@Arg("id") id: string) {
        try {
            return await this.assetService.getAssetById(id);
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => [Assets], { nullable: true })
    async assetByUserId(@Arg("assigned_to") assignedTo: string) {
        try {
            return this.assetService.getAssetsByUserId(assignedTo);
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => Assets)
    async assignAsset(
        @Arg("id") id: string,
        @Arg("assigned_to") assignedTo: string
    ) {
        try {
            return this.assetService.assignAsset(id, assignedTo);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }


    @Mutation(() => String)
    async requestAsset(@Arg("id") id: string) {
        return await this.assetService.requestAsset(id);
    }

}