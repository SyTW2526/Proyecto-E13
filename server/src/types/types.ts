// server/src/types/types.ts

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum SharePermission {
  VIEW = "VIEW",
  EDIT = "EDIT",
  ADMIN = "ADMIN",
}