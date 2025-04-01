import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Users } from "./entity/user.entity";
import { UserRole } from "./entity/user.enum";
import { UserService } from "./user.service";
import { UpdateUserInput } from "./entity/input";

@Resolver()
export class UserResolver {
    private userService = new UserService();

    constructor() {
        this.userService = new UserService();
    }

    @Query(() => [Users])
    async getAllUsers() {
        try {
            return await this.userService.getAllUsers();
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => Users, { nullable: true })
    async getUserById(@Arg("id") id: string) {
        try {
            return await this.userService.getUserById(id);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => Users)
    async registerUser(
        @Arg("name") name: string,
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("role", { defaultValue: UserRole.USER }) role: UserRole
    ) {
        try {
            return await this.userService.registerUser(name, email, password, role);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => String)
    async loginUser(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        try {
            return await this.userService.loginUser(email, password);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => String)
    async changePassword(@Arg("id") id: string, @Arg("password") password: string) {
        try {
            return await this.userService.changePassword(id, password);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => String)
    async addUser(@Arg("name") name: string, @Arg("email") email: string, @Arg("role") role: UserRole) {
        return this.userService.addUser(name, email, role);
    }

    @Mutation(() => Users)
    async updateUser(@Arg("input", () => UpdateUserInput) input: UpdateUserInput) {
        try {
            return await this.userService.updateUser(input);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => String)
    async deleteUser(@Arg("id") id: string) {
        try {
            return await this.userService.deleteUser(id);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
