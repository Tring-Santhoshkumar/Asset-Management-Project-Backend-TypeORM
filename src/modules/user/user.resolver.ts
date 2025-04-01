import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Users } from "./entity/user.entity";
import { UserRole } from "./entity/user.enum";
import { UserService } from "./user.service";


@Resolver()
export class UserResolver {
    private userService = new UserService();

    @Query(() => [Users])
    async getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Query(() => Users, { nullable: true })
    async getUserById(@Arg("id") id: string){
        console.log('id',id);
        return this.userService.getUserById(id);
    }

    @Mutation(() => Users)
    async registerUser(
        @Arg("name") name: string,
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("role", { defaultValue: UserRole.USER }) role: UserRole
    ){
        return this.userService.registerUser(name, email, password, role);
    }

    @Mutation(() => String)
    async loginUser(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        return this.userService.loginUser(email, password);
    }

    @Mutation(() => String)
    async changePassword(@Arg("id") id: string, @Arg("password") password: string) {
        return this.userService.changePassword(id, password);
    }

    // @Mutation(() => Users)
    // async updateUser(@Arg("input") input: Partial<Users>) {
    //     return this.userService.updateUser(input);
    // }

    @Mutation(() => String)
    async deleteUser(@Arg("id") id: string) {
        return this.userService.deleteUser(id);
    }
}
