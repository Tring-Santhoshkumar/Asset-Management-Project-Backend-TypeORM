import { Status, UserRole } from "../user.enum";

export const mockFindOne = jest.fn();
export const mockSave = jest.fn();

export const mockUsers = [
    {
        id: "1",
        name: "Santhosh",
        email: "santhosh@mailinator.com",
        password: "Admin@123",
        status: Status.ACTIVE,
        role: UserRole.ADMIN,
        reset_password: true,
        dob: "2003-06-22T00:00:00.000Z"
    },
    {
        id: "2",
        name: "Kumar",
        email: "kumar@mailinator.com",
        password: "Admin@100",
        status: Status.INACTIVE,
        role: UserRole.ADMIN,
        reset_password: true,
        dob: null
    },
]

const loginmockRepository: object = {
    findOne: mockFindOne,
    save: mockSave,
};

export default loginmockRepository;
