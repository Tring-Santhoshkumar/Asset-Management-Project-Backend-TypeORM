import { UserResolver } from "../src/modules/user/user.resolver";
import { buildSchema } from "type-graphql";

// export const createSchema = () =>
//   buildSchema({
//     resolvers: [UserResolver],
//     validate: false
// });



export async function createSchema() {
  return await buildSchema({
    resolvers: [UserResolver],
  });
}