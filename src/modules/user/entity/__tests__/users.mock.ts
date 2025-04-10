export const mockFind = jest.fn();
export const mockFindOne = jest.fn();
export const mockUpdate = jest.fn();
export const mockFindAndCount = jest.fn();
export const mockCreate = jest.fn();
export const mockSave = jest.fn();

const usersmockRepository: object = {
    find: mockFind,
    findOne: mockFindOne,
    update: mockUpdate,
    findAndCount: mockFindAndCount,
    create: mockCreate,
    save: mockSave
}

export default usersmockRepository;
