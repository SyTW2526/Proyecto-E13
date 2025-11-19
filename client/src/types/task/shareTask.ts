import { SharePermission } from "../permissions";

export interface TaskShare {
  id: string;
  permission: SharePermission;
  taskId: string;
  userId: string;
}
