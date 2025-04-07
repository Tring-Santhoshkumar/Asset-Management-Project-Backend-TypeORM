import { UserService } from "../modules/user/user.service"
import mockRepository, { mockCreate, mockFind, mockFindAndCount, mockFindOne, mockSave, mockUpdate } from "../__mocks__/users.mock"
import { mockUsers } from "../__mocks__/login.mock"
import { UserRole } from "../modules/user/entity/user.enum"

jest.mock("../database/data-source", () => {
    return {
        __esModule: true,
        default: {
            getRepository: jest.fn(() => mockRepository)
        }
    }
})


jest.mock("../utils/mailer/mailer", () => ({
    sendEmail: jest.fn(() => Promise.resolve()),
}));


describe("UserService - getAllUsers", () => {
    let userService: UserService;
    beforeEach(() => {
        jest.clearAllMocks();
        userService = new UserService();
        // let storedUser: any;
        // mockFindOne.mockImplementation(({ where: { id } }) => {
        //     storedUser = mockUsers.find(user => user.id === id);
        //     return Promise.resolve(storedUser || null);
        // })
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
        const user = mockUsers.find(user => user.dob === null);
        mockFindOne.mockResolvedValueOnce(user);
        const result = await userService.getUserById(user!.id);
        expect(result.dob).toBeNull();
    })

    test("Get a user - with DOB", async () => {
        const user = mockUsers.find(user => user.dob !== null);
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
})