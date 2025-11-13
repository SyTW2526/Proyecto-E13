import { SharePermission } from "../permissions";

export interface CategoryShare {
  id: string;
  permission: SharePermission;
  categoryId: string;
  userId: string;
}