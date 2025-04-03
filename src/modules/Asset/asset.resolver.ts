import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Assets } from "./entity/asset.entity";
import { AssetService } from "./asset.service";
import { addAssetInput, PaginatedAssets } from "./entity/input";



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
            throw new Error(`Error in allAssets resolver ${error}`);
        }
    }

    @Query(() => PaginatedAssets)
    async getAllAssetsPagination(
        @Arg("page", () => Int) page: number,
        @Arg("limit", () => Int) limit: number
    ){
        try{
            return await this.assetService.getAllAssetsPagination(page, limit);
        }
        catch(error : any){
            throw new Error(`Error in getAllAssetsPagination resolver ${error}`);
        }
    }


    @Query(() => Assets, { nullable: true })
    async asset(@Arg("id") id: string) {
        try {
            return await this.assetService.getAssetById(id);
        }
        catch (error: any) {
            throw new Error(`Error in asset resolver ${error}`);
        }
    }

    @Query(() => [Assets], { nullable: true })
    async assetByUserId(@Arg("assigned_to") assignedTo: string) {
        try {
            return this.assetService.getAssetsByUserId(assignedTo);
        }
        catch (error: any) {
            throw new Error(`Error in assetByUserId resolver ${error}`);
        }
    }

    @Mutation(() => [Assets])
    async insertAssets() {
        try {
            return this.assetService.insertAsset();
        }
        catch (error: any) {
            throw new Error(`Error in insertAssets resolver ${error}`);
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
            throw new Error(`Error in assignAsset resolver ${error}`);
        }
    }


    @Mutation(() => String)
    async requestAsset(@Arg("id") id: string) {
        try {
            return await this.assetService.requestAsset(id);
        }
        catch (error: any) {
            throw new Error(`Error in requestAsset resolver ${error}`);
        }
    }

    @Mutation(() => String)
    async addAsset(@Arg("input", () => addAssetInput) input: addAssetInput) {
        try {
            return await this.assetService.addAsset(input);
        } catch (error: any) {
            throw new Error(`Error in addAsset resolver ${error}`);
        }
    }

    @Mutation(() => String)
    async deleteAsset(@Arg("id") id: string) {
        try {
            return await this.assetService.deleteAsset(id);
        }
        catch (error: any) {
            throw new Error(`Error in deleteAsset resolver ${error}`);
        }
    }

    @Mutation(() => String)
    async deAssignAsset(@Arg("id") id: string) {
        try {
            return await this.assetService.deAssignAsset(id);
        }
        catch (error: any) {
            throw new Error(`Error in deAssignAsset resolver ${error}`);
        }
    }

}