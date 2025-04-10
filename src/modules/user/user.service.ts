import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { Users } from "./entity/user.entity";
import { Status, UserRole } from "./entity/user.enum";
import dataSource from "../../database/data-source";
import dotenv from "dotenv";
import { UpdateUserInput } from "./entity/input";
import { sendEmail } from "../../utils/mailer/mailer";
import { generatePassword } from "../../utils/password/password";
import { Assets } from "../Asset/entity/asset.entity";
import { Repository } from "typeorm";
import { AssignedStatus } from "../Asset/entity/asset.enum";

dotenv.config();
const userNull:string = "User not found";

export class UserService {

    private userRepository: Repository<Users>;
    private assetRepository: Repository<Assets>;
    
    constructor(){
        this.userRepository = dataSource.getRepository(Users);
        this.assetRepository = dataSource.getRepository(Assets);
    }

    async getAllUsers() {
        try {
            return await this.userRepository.find({ relations: ["assets", "notifications"] });
        }
        catch (error) {
            throw new Error('Error in getAllUsers resolver ' + error);
        }
    }

    async getAllUsersPagination(page: number, limit: number, role?: UserRole){
        try {
            const [users, totalCount] = await this.userRepository.findAndCount({ where: role ? { role } : {}, 
                relations: ["assets", "notifications"], take: limit, skip: (page - 1) * limit });
            return { users, totalCount };
        }
        catch (error) {
            throw new Error('Error in getAllUsers resolver' +error);
        }
    }

    async getUserById(id: string) {
        try {
            const user = await this.userRepository.findOne({ where: { id }, relations: ["assets", "notifications"] });
            if (!user){
                throw new Error(userNull);
            }
            if(user && user.dob){
                user.dob = new Date(user.dob).toISOString().split("T")[0];
            }
            return user;
        }
        catch (error: any) {
            throw new Error(`Error in getUserById: ${error.message}`)
        }
    }

    async getLatestUpdatedUser(){
        try{
            const users = await this.userRepository.find({ order: { updated_at: "DESC" }});
            if(!users){
                throw new Error(userNull);
            }
            const latest = users[0];
            const oldest = users[users.length -1];
            return { latest, oldest};
        }
        catch(error){
            throw new Error('Error in getLatestUpdatedUser ' + error);
        }
    }

    async registerUser(name: string, email: string, password: string, role: UserRole) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = this.userRepository.create({ name, email, password: hashedPassword, role });
            return this.userRepository.save(newUser);
        }
        catch (error: any) {
            throw new Error(`Error in registerUser: ${error.message}`);
        }
    }

    async loginUser(email: string, password: string) {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            if (user?.status === 'Inactive' || !user || !(await bcrypt.compare(password, user.password))) {
                return !user ? 'No User' : user.status === 'Inactive' ? "Inactive User" : 'Invalid Password';
            }
            const token = jwt.sign({ id: user.id, role: user.role, reset_password: user.reset_password }, process.env.SECRET_KEY as any, { expiresIn: "1h" });

            if (user.reset_password) {
                user.reset_password = false;
                await this.userRepository.save(user);
            }
            return token;
        } catch (error: any) {
            throw new Error(`Error in loginUser: ${error.message}`);
        }
    }

    async changePassword(id: string, password: string) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await this.userRepository.update(id, { password: hashedPassword });
            return result.affected ? "Successfully Changed Password!" : "Failed to Change Password.";
        }
        catch (error: any) {
            throw new Error(`Error in changePassword: ${error.message}`);
        }
    }

    async addUser(name: string, email: string, role: UserRole) {
        try {
            const alreadyExist = await this.userRepository.findOne({ where: { email } });
            if (alreadyExist) throw new Error("User already exists.");
            const temporaryPassword = generatePassword();
            const hashedTempPassword = await bcrypt.hash(temporaryPassword, 10);
            const newUser = this.userRepository.create({ name, email, password: hashedTempPassword, role, created_at: new Date(), updated_at: new Date() });
            await this.userRepository.save(newUser);
            await sendEmail({
                to: email,
                subject: "Your Temporary Password",
                html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #0056b3;">Welcome to Tringapps!</h2>
                <p>Dear ${name},</p>
                <p>We are pleased to inform you that your account has been successfully created on our system.</p>
                <h3>Your Account Details:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> <i>${temporaryPassword}</i></p>
                <p>For security reasons, we strongly recommend that you log in and update your password immediately.</p>
                <h3>How to Log In:</h3>
                <p>Go to our login page: <a href=${process.env.LOGIN_URL} style="color: #0056b3;">Login</a></p>
                <p>Enter your email and the temporary password provided above.</p>
                <p>Follow the on-screen instructions to set up a new password.</p>
                <p>If you did not request this account, please contact our support team immediately.</p>
                <hr />
                <p>Best regards,</p>
                <p><strong>Tringapps Research Labs Pvt Ltd</strong></p>
                <p>Email: <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a></p>
                </div>`
            });
            return "User added successfully!";
        } catch (err: any) {
            throw new Error(`Error in add user ${err}`);
        }
    }

    async updateUser(input: UpdateUserInput) {
        try {
            const user = await this.userRepository.findOne({ where: { id: input.id } });
            if (!user) throw new Error(userNull);
            Object.assign(user, input);
            return await this.userRepository.save(user);
        }
        catch (error: any) {
            throw new Error(`Error in update user : ${error.message}`);
        }
    }

    async deleteUser(id: string) {
        try {
            const user = await this.userRepository.findOne({ where: { id }, relations: ["assets"] });
            if (!user) throw new Error(userNull);
            if (user.assets && user.assets.length > 0) {
                await this.assetRepository.update({ assignedTo: { id } },{ assignedTo: null as any, assigned_status: AssignedStatus.AVAILABLE });
            }
            const result = await this.userRepository.update(id, { status: Status.INACTIVE, deleted_at: new Date() });
            if (result.affected) {
                await sendEmail({
                    to: user.email,
                    subject: "Your Account Has Been Deleted",
                    html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #d9534f;">Important Notice: Account Deletion</h2>
                    <p>Dear ${user.name},</p>
                    <p>We regret to inform you that your account with <strong>Tringapps</strong> has been deleted by an administrator. As a result, you will no longer have access to our services.</p>
                    <p>If you believe this was done in error or require further assistance, please contact our support team.</p>
                    <hr />
                    <p>Best regards,</p>
                    <p><strong>Tringapps Research Labs Pvt Ltd</strong></p>
                    <p>Email: <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a></p>
                    </div>`
                });
                return "User Deleted Successfully!";
            }
            return "Failed to Delete User.";
        }
        catch (error: any) {
            throw new Error(`Error in delete user : ${error}`);
        }
    }
}


