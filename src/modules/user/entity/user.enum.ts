import { registerEnumType } from "type-graphql";

export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}


export enum Status {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}

registerEnumType(UserRole, {name: "UserRole"});

