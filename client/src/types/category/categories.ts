import { Task } from "../task/task";
import { CategoryShare } from "./shareCategory";

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  listId: string;
  tasks: Task[];
  shares: CategoryShare[];
}

export interface CategoriesState {
  categories: Category[];
  selectedCategoryId: string | null;
  isLoading: boolean;
  error: string | null;
}