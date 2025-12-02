import { useState, memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import { Checkbox } from "@/components/customized/checkbox/checkbox-09";
import CreateTaskDialog from "@/components/createDialogs/createTaskDialog";
import ShareTaskDialog from "./ShareTaskDialog";
import { priorityConfig, statusConfig } from "@/config/taskConfig";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import type { Task, TaskStatus, TaskPriority } from "@/types/tasks-system/task";
import type { List } from "@/types/tasks-system/list";
import type { SharePermission } from "@/types/permissions";

interface SharedTaskCardProps {
  task: Task;
  list?: List;
  formatDate: (dateString?: string) => string;
}

export const SharedTaskCard = memo(function SharedTaskCard({
  task,
  list,
  formatDate,
}: SharedTaskCardProps) {
  const { user } = useAuth();
  const priorityStyle = priorityConfig[task.priority];
  const statusStyle = statusConfig[task.status];
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { toggleFavorite, removeTask, editTask } = useTasks();

  // Calculate permission
  let permission: SharePermission = "VIEW";
  const myId = user?.id;
  const taskShare = task.shares?.find((s) => s.userId === myId);
  const listShare = list?.shares?.find((s) => s.userId === myId);

  if (taskShare) permission = taskShare.permission;
  else if (listShare) permission = listShare.permission;

  const canEdit = permission === "EDIT" || permission === "ADMIN";
  const canDelete = permission === "ADMIN";
  const canShare = permission === "ADMIN";

  // Determine owner
  const owner = task.list?.owner || list?.owner;

  return (
    <Card className="group relative flex flex-col shadow-none border border-border/40 bg-card hover:shadow-sm transition-all duration-200 overflow-hidden rounded-xl">
      <CardContent className="flex flex-col gap-4 w-full">
        {/* Top Section: Actions (Left) and Status/Priority/Favorite (Right) */}
        <div className="flex justify-between items-center w-full">
          {/* Actions Menu (Left) */}
          <div className="flex items-center gap-2">
            {(canEdit || canDelete || canShare) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  >
                    <Icon as="IconDotsVertical" size={16} />
                    <span className="sr-only">Abrir menú</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {canShare && (
                    <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
                      <Icon as="IconShare" className="mr-2" />
                      Compartir
                    </DropdownMenuItem>
                  )}
                  {canEdit && (
                    <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                      <Icon as="IconEdit" className="mr-2" />
                      Editar
                    </DropdownMenuItem>
                  )}
                  {(canEdit || canShare) && canDelete && (
                    <DropdownMenuSeparator />
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Icon as="IconTrash" className="mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Owner Info */}
            {owner && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      <Icon as="IconUser" size={12} />
                      <span className="max-w-[100px] truncate">
                        {owner.name}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Compartido por: {owner.email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Status, Priority, Favorite (Right) */}
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap gap-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="focus:outline-none"
                  disabled={!canEdit}
                >
                  <Badge
                    variant="outline"
                    className={`${statusStyle.color} ${canEdit ? "cursor-pointer hover:opacity-80" : "cursor-default opacity-80"} transition-opacity`}
                    leftIcon="IconCircle"
                  >
                    {statusStyle.label}
                  </Badge>
                </DropdownMenuTrigger>
                {canEdit && (
                  <DropdownMenuContent align="end">
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() =>
                          editTask({ id: task.id, status: key as TaskStatus })
                        }
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${config.color.replace("bg-", "bg-").replace("/10", "")} bg-current opacity-70`}
                        />
                        {config.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="focus:outline-none"
                  disabled={!canEdit}
                >
                  <Badge
                    variant="outline"
                    className={`${priorityStyle.color} ${canEdit ? "cursor-pointer hover:opacity-80" : "cursor-default opacity-80"} transition-opacity`}
                    leftIcon="IconFlag"
                  >
                    {priorityStyle.label}
                  </Badge>
                </DropdownMenuTrigger>
                {canEdit && (
                  <DropdownMenuContent align="end">
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() =>
                          editTask({
                            id: task.id,
                            priority: key as TaskPriority,
                          })
                        }
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${config.color.replace("bg-", "bg-").replace("/10", "")} bg-current opacity-70`}
                        />
                        {config.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </div>

            {/* Favorite Checkbox */}
            <Checkbox
              checked={task.favorite}
              onCheckedChange={() => toggleFavorite(task.id)}
              className="cursor-pointer hover:scale-110 transition-transform duration-200 ml-1"
              icon={
                <Icon
                  as="IconStar"
                  size={16}
                  className="text-muted-foreground hover:text-yellow-400 transition-colors duration-200"
                />
              }
              checkedIcon={
                <Icon
                  as="IconStar"
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />
              }
            />
          </div>
        </div>

        {/* Left Section: Title & Description */}
        <div className="flex-1 flex flex-col justify-center text-left">
          <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {task.name}
          </h3>

          {/* Dates */}
          <div className="flex flex-row gap-1.5 mt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon
                as="IconCalendarPlus"
                size={14}
                className="text-muted-foreground shrink-0"
              />
              <span>{formatDate(task.createdAt)}</span>
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon
                  as="IconCalendarEvent"
                  size={14}
                  className="text-muted-foreground shrink-0"
                />
                <span>{task.dueDate ? formatDate(task.dueDate) : "-"}</span>
              </div>
            )}
          </div>
          {task.description && (
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <CreateTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editTask={task}
      />

      {/* Share Dialog */}
      <ShareTaskDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        task={task}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La tarea "{task.name}" será
              eliminada permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                removeTask(task.id);
                setDeleteDialogOpen(false);
              }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
});
