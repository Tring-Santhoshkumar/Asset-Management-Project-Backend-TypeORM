import { UserService } from "../../user.service"
import mockRepository, { mockCreate, mockFind, mockFindAndCount, mockFindOne, mockSave, mockUpdate } from "./users.mock"
import { mockUsers } from "./login.mock"
import { UserRole } from "../user.enum"

jest.mock("../../../../database/data-source", () => {
    return {
        __esModule: true,
        default: {
            getRepository: jest.fn(() => mockRepository)
        }
    }
})


jest.mock(".../../../../utils/mailer/mailer", () => ({
    sendEmail: jest.fn(() => Promise.resolve()),
}));


describe("UserService - getAllUsers", () => {
    let userService: UserService;
    beforeEach(() => {
        jest.clearAllMocks();
        userService = new UserService();
    })

    test("All users - Null users", async () => {
        mockFind.mockResolvedValueOnce(null);
        const result = await userService.getAllUsers();
        expect(result).toBeNull();
    })

    test("All Users", async () => {
        mockFind.mockResolvedValueOnce(mockUsers);
        const result = await userService.getAllUsers();
        expect(result).toEqual(mockUsers);
    })

    test("Get a user - Null user", async () => {
        await expect(userService.getUserById('3')).rejects.toThrow("User not found");
    })

    test("Get a user - without DOB", async () => {
        const user = mockUsers.find(users => users.dob === null);
        mockFindOne.mockResolvedValueOnce(user);
        const result = await userService.getUserById(user!.id);
        expect(result.dob).toBeNull();
    })

    test("Get a user - with DOB", async () => {
        const user = mockUsers.find(users => users.dob !== null);
        mockFindOne.mockResolvedValueOnce(user);
        const result = await userService.getUserById(user!.id);
        const formatDob = new Date(result!.dob!).toISOString().split('T')[0];
        expect(result.dob).toBe(formatDob);
    })

    test("getAllUsersPagination - Return users and total count", async () => {
        mockFindAndCount.mockResolvedValueOnce([mockUsers, mockUsers.length]);
        const result = await userService.getAllUsersPagination(1, 10);
        expect(result.users).toEqual(mockUsers);
        expect(result.totalCount).toBe(mockUsers.length);
    });

    test("addUser - Add User", async () => {
        mockFindOne.mockResolvedValueOnce(null);
        mockCreate.mockReturnValueOnce({
            name : "Dipshy", email: "dipshy@mailinator.com", role: UserRole.USER, password: "hashPassword", created_at: expect.any(Date), updated_at: expect.any(Date)
        })
        mockSave.mockResolvedValueOnce({ id: "3", name: "Dipshy"});
        const result = await userService.addUser("Dipshy", "dipshy@mailinator.com", UserRole.USER);
        expect(result).toBe("User added successfully!");
    });

})
