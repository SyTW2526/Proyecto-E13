import { Category } from "../category/categories";
import { ListShare } from "./shareList";

export interface List {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  categories: Category[];
  ownerId: string;
  shares: ListShare[];
}

export interface ListsState {
  lists: List[];
  selectedListId: string | null;
  isLoading: boolean;
  error: string | null;
}
