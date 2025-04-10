import { UserService } from "../../user.service";
import { Status, UserRole } from "../user.enum";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mockRepository, { mockFindOne, mockUsers } from "./login.mock";

interface UserType{
    id: string,
    name: string,
    email: string,
    password: string,
    status: Status,
    role: UserRole,
    reset_password: boolean,
    dob: string | null
}

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

jest.mock("../../../../database/data-source", () => {
    return {
        __esModule: true,
        default: {
            getRepository: jest.fn(() => mockRepository),
        }
    }
});

describe("UserService - loginUser", () => {
    let userService: UserService;
    beforeEach(() => {
        jest.clearAllMocks();
        userService = new UserService();
        let storedUser: UserType | null;
        mockFindOne.mockImplementation(({ where: { email } }) => {
            storedUser = mockUsers.find(user => user.email === email) ?? null;
            return Promise.resolve(storedUser);
        });
        (bcrypt.compare as jest.Mock).mockImplementation((inputPassword, storedPassword) => {
            return Promise.resolve(storedUser && inputPassword === storedPassword);
        });
        (jwt.sign as jest.Mock).mockReturnValue("JWT TOKEN");
    });

    test("No User", async () => {
        const result = await userService.loginUser("test@mailinator.com", "Admin@123");
        expect(result).toBe("No User");
    });

    test("Inactive User", async () => {
        const user = mockUsers.find(users => users.status === Status.INACTIVE)!;
        const result = await userService.loginUser(user.email, user.password);
        expect(result).toBe("Inactive User");
    });

    test("should return 'Invalid Password' if password does not match", async () => {
        const result = await userService.loginUser("santhosh@mailinator.com", "Admin@13");
        expect(result).toBe("Invalid Password");
    });

    test("should return JWT token if valid", async () => {
        const result = await userService.loginUser("santhosh@mailinator.com", "Admin@123");
        expect(result).toBe("JWT TOKEN");
    });
});
