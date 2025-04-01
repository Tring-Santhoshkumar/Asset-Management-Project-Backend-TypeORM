// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { AppDataSource } from "../config/data-source";
// import { User } from "../entities/User";
// import { sendEmail } from "../utils/Mail/mailer";
// import { generatePassword } from "../utils/Password/generatePassword";
// import dotenv from "dotenv";

// dotenv.config();

// const userRepository = AppDataSource.getRepository(User);

// export const userService = {
//     getAllUsers: async () => {
//         try {
//             const users = await userRepository.find({ relations: ["assets"] });
//             return users;
//         } catch (error) {
//             throw new Error(`Error fetching users: ${error.message}`);
//         }
//     },

//     getUserById: async (id: string) => {
//         try {
//             const user = await userRepository.findOne({
//                 where: { id },
//                 relations: ["assets"],
//             });

//             if (!user) {
//                 throw new Error("User not found");
//             }

//             return { ...user, dob: user.dob ? user.dob.toISOString().split("T")[0] : null };
//         } catch (error) {
//             throw new Error(`Error in getUserById: ${error.message}`);
//         }
//     },

//     registerUser: async (name: string, email: string, password: string, role: string) => {
//         try {
//             const hashedPassword = await bcrypt.hash(password, 10);
//             const newUser = userRepository.create({ name, email, password: hashedPassword, role });
//             await userRepository.save(newUser);
//             return newUser;
//         } catch (error) {
//             throw new Error(`Error in registerUser: ${error.message}`);
//         }
//     },

//     loginUser: async (email: string, password: string) => {
//         try {
//             const user = await userRepository.findOne({ where: { email } });

//             if (!user) return "No User";
//             if (!(await bcrypt.compare(password, user.password))) return "Invalid Password";
//             if (user.status === "Inactive") return "Inactive User";

//             const token = jwt.sign(
//                 { id: user.id, role: user.role, reset_password: user.reset_password },
//                 process.env.JWT_SECRET_KEY!,
//                 { expiresIn: "1h" }
//             );

//             if (user.reset_password) {
//                 user.reset_password = false;
//                 await userRepository.save(user);
//             }

//             return token;
//         } catch (error) {
//             throw new Error(`Error in loginUser: ${error.message}`);
//         }
//     },

//     changePassword: async (id: string, password: string) => {
//         try {
//             const hashedPassword = await bcrypt.hash(password, 10);
//             const result = await userRepository.update(id, { password: hashedPassword });

//             return result.affected ? "Successfully Changed Password!" : "Failed to Change Password.";
//         } catch (error) {
//             throw new Error(`Error in changePassword: ${error.message}`);
//         }
//     },

//     addUser: async (name: string, email: string, role: string) => {
//         try {
//             const existingUser = await userRepository.findOne({ where: { email } });
//             if (existingUser) throw new Error("User already exists.");

//             const temporaryPassword = generatePassword();
//             const hashedTempPassword = await bcrypt.hash(temporaryPassword, 10);

//             await sendEmail({
//                 to: email,
//                 subject: "Your Temporary Password",
//                 html: `<p>Your temporary password is: <b>${temporaryPassword}</b></p>`,
//             });

//             const newUser = userRepository.create({
//                 name,
//                 email,
//                 password: hashedTempPassword,
//                 role,
//                 created_at: new Date(),
//                 updated_at: new Date(),
//             });

//             await userRepository.save(newUser);

//             return "User added successfully!";
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     },

//     updateUser: async (args: Partial<User>) => {
//         try {
//             const user = await userRepository.findOne({ where: { id: args.id } });
//             if (!user) throw new Error("User not found");

//             Object.assign(user, args);
//             await userRepository.save(user);
//             return user;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     },

//     deleteUser: async (id: string) => {
//         try {
//             const user = await userRepository.findOne({ where: { id } });
//             if (!user) throw new Error("User not found");

//             user.status = "Inactive";
//             user.deleted_at = new Date();
//             await userRepository.save(user);

//             await sendEmail({
//                 to: user.email,
//                 subject: "Your Account Has Been Deleted",
//                 html: `<p>Your account has been deleted.</p>`,
//             });

//             return "User Deleted Successfully!";
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     },
// };


import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { Users } from "./entity/user.entity";
import { Status, UserRole } from "./entity/user.enum";
import dataSource from "../../database/data-source";
import dotenv from "dotenv";

dotenv.config();

export class UserService {
    private userRepository = dataSource.getRepository(Users);

    async getAllUsers() {
        return this.userRepository.find({ relations: ["assets", "notifications"] });
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findOne({ where: { id }, relations: ["assets", "notifications"] });
        if (!user) throw new Error("User not found");
        return user;
    }

    async registerUser(name: string, email: string, password: string, role: UserRole) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({ name, email, password: hashedPassword, role });
        return await this.userRepository.save(newUser);
    }

    async loginUser(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) return "No User";
        if (!(await bcrypt.compare(password, user.password))) return "Invalid Password";
        if (user.status === "Inactive") return "Inactive User";

        const token = jwt.sign(
            { id: user.id, role: user.role, reset_password: user.reset_password },
            process.env.JWT_SECRET_KEY || "default_secret",
            { expiresIn: "1h" }
        );

        if (user.reset_password) {
            user.reset_password = false;
            await this.userRepository.save(user);
        }

        return token;
    }

    async changePassword(id: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await this.userRepository.update(id, { password: hashedPassword });
        return result.affected ? "Successfully Changed Password!" : "Failed to Change Password.";
    }

    // async updateUser(input: Partial<Users>) {
    //     const user = await this.userRepository.findOne({ where: { id: input.id } });
    //     if (!user) throw new Error("User not found");

    //     Object.assign(user, input);
    //     return await this.userRepository.save(user);
    // }

    async deleteUser(id: string) {
        const result = await this.userRepository.update(id, { status: Status.INACTIVE, deleted_at: new Date() });
        return result.affected ? "User Deleted Successfully!" : "Failed to Delete User.";
    }
}
