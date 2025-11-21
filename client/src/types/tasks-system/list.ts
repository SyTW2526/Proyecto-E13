import { Task } from "./task";
import { SharePermission } from "../permissions";

export interface List {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  tasks: Task[];
  ownerId: string;
  shares: ListShare[];
}

export interface ListsState {
  lists: List[];
  selectedListId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ListShare {
  id: string;
  permission: SharePermission;
  listId: string;
  userId: string;
}
