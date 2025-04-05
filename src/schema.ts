import { NotificationResolver } from "../src/modules/Notification/notification.resolver";
import { AssetResolver } from "../src/modules/Asset/asset.resolver";
import { UserResolver } from "../src/modules/user/user.resolver";
import { buildSchema } from "type-graphql";

export async function createSchema() {
  return await buildSchema({
    resolvers: [UserResolver,AssetResolver,NotificationResolver],
    validate: false
  });
}