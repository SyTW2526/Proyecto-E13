import { SharePermission } from "../permissions";

export interface ListShare {
  id: string;
  permission: SharePermission;
  listId: string;
  userId: string;
}
