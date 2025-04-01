import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Assets } from "./entity/asset.entity";
import { AssetService } from "./asset.service";



@Resolver()
export class AssetResolver{
    private assetService = new AssetService();

    @Query(() => [Assets])
    async allAssets(){
        return this.assetService.getAllAssets();
    }

    @Query(() => Assets, { nullable: true})
    async asset(@Arg("id") id: string){
        return this.assetService.getAssetById(id);
    }

    @Query(() => [Assets], { nullable: true})
    async assetByUserId(@Arg("assigned_to") assigned_to: string){
        return this.assetService.getAssetsByUserId(assigned_to);
    }

    @Mutation(() => Assets)
    async assignAsset(
        @Arg("id") id: string,
        @Arg("assigned_to") assigned_to: string
    ){
        return this.assetService.assignAsset(id,assigned_to);
    }

}