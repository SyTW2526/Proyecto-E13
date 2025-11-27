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
import {
  priorityConfig,
  statusConfig,
  tasksPageLabels,
} from "@/config/taskConfig";
import type { Task } from "@/types/tasks-system/task";
import type { List } from "@/types/tasks-system/list";

interface TaskCardProps {
  task: Task;
  list?: List;
  formatDate: (dateString?: string) => string;
}

export function TaskCard({ task, list, formatDate }: TaskCardProps) {
  const priorityStyle = priorityConfig[task.priority];
  const statusStyle = statusConfig[task.status];

  return (
    <Card className="group relative flex flex-col shadow-none border border-border/40 bg-card hover:bg-card hover:shadow-sm transition-all duration-200 overflow-hidden rounded-xl">
      <CardContent className="flex flex-col sm:flex-row gap-6 w-full">
        {/* Left Section: Title & Description */}
        <div className="flex-1 flex flex-col justify-center text-left">
          <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors pr-8 sm:pr-0">
            {task.name}
          </h3>
          {task.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Right Section: Metadata */}
        <div className="flex flex-col gap-1.5 sm:min-w-[160px] border-t sm:border-t-0 sm:border-l border-border/40 pt-4 sm:pt-0 sm:pl-6">
          {/* Status */}
          <div className="flex items-baseline gap-2 text-xs">
            <span className="text-muted-foreground/70 font-medium uppercase tracking-wider text-[10px]">
              Estado
            </span>
            <span
              className={`font-medium ${statusStyle.color.replace(
                "bg-",
                "text-",
              )}`}
            >
              {statusStyle.label}
            </span>
          </div>

          {/* Priority */}
          <div className="flex items-baseline gap-2 text-xs">
            <span className="text-muted-foreground/70 font-medium uppercase tracking-wider text-[10px]">
              Prioridad
            </span>
            <span
              className={`font-medium ${priorityStyle.color.replace(
                "bg-",
                "text-",
              )}`}
            >
              {priorityStyle.label}
            </span>
          </div>

          {/* List */}
          {list && (
            <div className="flex items-baseline gap-2 text-xs">
              <span className="text-muted-foreground/70 font-medium uppercase tracking-wider text-[10px]">
                Lista
              </span>
              <span className="font-medium text-foreground">{list.name}</span>
            </div>
          )}

          {/* Dates */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/70 font-medium uppercase tracking-wider text-[10px]">
                Creado
              </span>
              <span>{formatDate(task.createdAt)}</span>
            </div>
            {task.dueDate && (
              <div className="flex items-baseline gap-2 text-xs text-muted-foreground/70">
                <span className="text-muted-foreground/70 font-medium uppercase tracking-wider text-[10px]">
                  Vence
                </span>
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            {!task.dueDate && (
              <div className="flex items-baseline gap-2 text-xs text-muted-foreground/70">
                <span className="text-muted-foreground/70 font-medium uppercase tracking-wider text-[10px]">
                  Vence
                </span>
                <span>-</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      {task.favorite && (
        <div className="absolute top-5 right-5 sm:top-5 sm:right-auto sm:left-5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {/* Mobile: Top Right. Desktop: Top Left (or maybe keep it simple) 
               Actually, let's keep it Top Right but adjust for the split layout.
               If I put it Top Right, it might overlap with metadata on mobile?
               Let's put it absolute top-right but maybe with some padding.
           */}
          {/* Re-thinking favorite icon placement. 
               The user didn't specify, but absolute top-right is standard.
               However, on mobile, top-right is where the metadata starts? No, metadata is below.
               Let's stick to absolute top-right.
           */}
        </div>
      )}
      {task.favorite && (
        <div className="absolute top-3 right-10">
          <Icon
            as="IconStar"
            size={14}
            className="text-yellow-500 fill-yellow-500"
          />
        </div>
      )}

      <div className="absolute top-3 right-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <Icon
                as="IconDotsVertical"
                size={16}
                className="text-muted-foreground"
              />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
            >
              <Icon as="IconShare" size={14} className="mr-2" />
              Compartir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Edit task", task.id)}>
              <Icon as="IconEdit" size={14} className="mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => console.log("Delete task", task.id)}
            >
              <Icon as="IconTrash" size={14} className="mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
