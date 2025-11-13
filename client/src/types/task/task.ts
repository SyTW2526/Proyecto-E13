import { TaskShare } from "../task/shareTask";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  categoryId: string;
  completed: boolean;
  shares: TaskShare[];
}

export interface TasksState {
  tasks: Task[];
  selectedTaskId: string | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: "all" | TaskStatus;
    categoryId: string | null;
    search: string;
    priority: "all" | TaskPriority;
  };
  sorting: {
    field: "name" | "dueDate" | "priority" | "createdAt";
    order: "asc" | "desc";
  };
}
