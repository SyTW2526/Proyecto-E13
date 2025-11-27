import { useState } from "react";
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
import Icon from "@/components/ui/icon";
import { Checkbox } from "@/components/customized/checkbox/checkbox-09";
import CreateTaskDialog from "@/components/createDialogs/createTaskDialog";
import { priorityConfig, statusConfig } from "@/config/taskConfig";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types/tasks-system/task";
import type { List } from "@/types/tasks-system/list";

interface TaskCardProps {
  task: Task;
  list?: List;
  formatDate: (dateString?: string) => string;
}

export function TaskCard({ task, formatDate }: TaskCardProps) {
  const priorityStyle = priorityConfig[task.priority];
  const statusStyle = statusConfig[task.status];
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toggleFavorite } = useTasks();

  return (
    <Card className="group relative flex flex-col shadow-none border border-border/40 bg-card hover:shadow-sm transition-all duration-200 overflow-hidden rounded-xl">
      <CardContent className="flex flex-col gap-4 w-full">
        {/* Top Section: Status, Priority, Favorite, and Actions */}
        <div className="flex items-center gap-2 self-end">
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant="outline"
              className={statusStyle.color}
              leftIcon="IconCircle"
            >
              {statusStyle.label}
            </Badge>
            <Badge
              variant="outline"
              className={priorityStyle.color}
              leftIcon="IconFlag"
            >
              {priorityStyle.label}
            </Badge>
          </div>

          {/* Favorite Checkbox */}
          <Checkbox
            checked={task.favorite}
            onCheckedChange={() => toggleFavorite(task.id)}
            icon={<Icon as="IconStar" size={16} />}
            checkedIcon={
              <Icon
                as="IconStar"
                className="fill-yellow-400 stroke-yellow-400"
              />
            }
          />

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-6 w-6"
                leftIcon="IconDotsVertical"
              >
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
              >
                <Icon as="IconShare" className="mr-2" />
                Compartir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Icon as="IconEdit" className="mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => console.log("Delete task", task.id)}
              >
                <Icon as="IconTrash" className="mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
    </Card>
  );
}
