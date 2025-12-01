import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { Checkbox } from "@/components/customized/checkbox/checkbox-09";
import CreateTaskDialog from "@/components/createDialogs/createTaskDialog";
import ShareTaskDialog from "./ShareTaskDialog";

import { useTasks } from "@/hooks/useTasks";
import type { Task, TaskStatus, TaskPriority } from "@/types/tasks-system/task";
import type { List } from "@/types/tasks-system/list";
import {
  TaskStatusFilter,
  TaskPriorityFilter
} from "@/components/tasks/TaskFilters";


interface TaskCardProps {
  task: Task;
  list?: List;
  formatDate: (dateString?: string) => string;
}

export function TaskCard({ task, formatDate }: TaskCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { toggleFavorite, removeTask, editTask } = useTasks();

  return (
    <Card className="group relative flex flex-col shadow-none border border-border/40 bg-card hover:shadow-sm transition-all duration-200 overflow-hidden rounded-xl">
      <CardContent className="flex flex-col gap-4 w-full">
        {/* Top Section: Actions (Left) and Status/Priority/Favorite (Right) */}
        <div className="flex justify-between items-center w-full">
          {/* Actions Menu (Left) */}
          <ItemActionsMenu
            onShare={() => setShareDialogOpen(true)}
            onEdit={() => setEditDialogOpen(true)}
            onDelete={() => setDeleteDialogOpen(true)}
            align="start"
          />


          {/* Favorite Checkbox */}
          <Checkbox
            checked={task.favorite}
            onCheckedChange={() => toggleFavorite(task.id)}
            className="cursor-pointer hover:scale-110 transition-transform duration-200"
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

          <div className="flex items-center gap-1">
            {/* Status Filter */}
            <TaskStatusFilter
              variant="compact"
              value={task.status}
              onChange={(status) => {
                if (status !== "all") {
                  editTask({ id: task.id, status });
                }
              }}
              showAll={false}
            />

            {/* Priority Filter */}
            <TaskPriorityFilter
              variant="compact"
              value={task.priority}
              onChange={(priority) => {
                if (priority !== "all") {
                  editTask({ id: task.id, priority });
                }
              }}
              showAll={false}
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
}
