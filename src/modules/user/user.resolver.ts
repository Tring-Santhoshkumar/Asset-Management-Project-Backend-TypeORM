import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Users } from "./entity/user.entity";
import { UserRole } from "./entity/user.enum";
import { UserService } from "./user.service";
import { PaginatedUsers, UpdatedUsers, UpdateUserInput } from "./entity/input";

@Resolver()
export class UserResolver {
    private userService = new UserService();

    constructor() {
        this.userService = new UserService();
    }

    @Query(() => [Users])
    async users() {
        try {
            return await this.userService.getAllUsers();
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => PaginatedUsers)
    async paginatedUsers(
        @Arg("page", () => Int) page: number,
        @Arg("limit", () => Int) limit: number
    ){
        try{
            return await this.userService.getAllUsersPagination(page, limit);
        }catch(error){
            throw new Error('paginatedUsers resolver ' + error);
        }
    }

    @Query(() => Users, { nullable: true })
    async user(@Arg("id") id: string) {
        try {
            return await this.userService.getUserById(id);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => UpdatedUsers)
    async latestUpdatedUser(){
        try{
            return await this.userService.getLatestUpdatedUser();
        }
        catch(error: any){
            throw new Error(error);
        }
    }

    @Mutation(() => Users)
    async register(
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
    async login(
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
