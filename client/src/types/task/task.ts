import { TaskShare } from "../task/shareTask";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string; // Identificador único de la tarea
  name: string; // Nombre o título de la tarea
  description?: string; // Descripción detallada de la tarea
  status: TaskStatus; // Estado actual de la tarea
  priority: TaskPriority; // Prioridad de la tarea
  dueDate?: string; // Fecha límite para completar la tarea
  completedAt?: string; // Fecha en que se completó la tarea
  createdAt: string; // Fecha de creación de la tarea
  categoryId: string; // Identificador de la categoría
  completed: boolean; // Indica si la tarea está completada
  shares: TaskShare[]; // Lista de comparticiones de la tarea
  favorite: boolean; // Indica si la tarea está en favoritos
  updatedAt: string; // Fecha de la última actualización de la tarea
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
    field: "name" | "dueDate" | "priority" | "createdAt" | "updatedAt";
    order: "asc" | "desc";
  };
}
