import { registerEnumType } from "type-graphql";

export enum AssetCondition {
    NEW = "New",
    GOOD = "Good",
    DAMAGED = "Damaged",
    NEEDS_REPAIR = "Needs Repair"
}

export enum AssignedStatus {
    ASSIGNED = "Assigned",
    AVAILABLE = "Available"
}


registerEnumType(AssignedStatus, { name: "AssignedStatus"})
