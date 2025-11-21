import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import {
  priorityConfig,
  statusConfig,
  tasksPageLabels,
} from "@/config/taskConfig";
import type { Task } from "@/types/task/task";
import type { Category } from "@/types/category/categories";

interface TaskCardProps {
  task: Task;
  category?: Category;
  formatDate: (dateString?: string) => string;
}

export function TaskCard({ task, category, formatDate }: TaskCardProps) {
  const priorityStyle = priorityConfig[task.priority];
  const statusStyle = statusConfig[task.status];

  return (
    <Card className="flex flex-col sm:flex-row sm:items-start shadow-none overflow-hidden rounded-md border py-4">
      <CardContent className="px-6 py-0 flex flex-col flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          {category && (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 shadow-none">
              {category.name}
            </Badge>
          )}
          <Badge
            className={`${priorityStyle.color} hover:${priorityStyle.color} shadow-none`}
          >
            <Icon as="IconAlertCircle" size={12} className="mr-1" />
            {priorityStyle.label}
          </Badge>
          <Badge
            className={`${statusStyle.color} hover:${statusStyle.color} shadow-none`}
          >
            {task.completed && (
              <Icon as="IconCheck" size={12} className="mr-1" />
            )}
            {statusStyle.label}
          </Badge>
          {task.favorite && (
            <Icon
              as="IconStar"
              size={16}
              className="text-yellow-500 fill-yellow-500"
            />
          )}
        </div>

        <h3 className="mt-4 text-xl font-semibold tracking-tight">
          {task.name}
        </h3>
        {task.description && (
          <p className="mt-2 text-muted-foreground line-clamp-3 text-ellipsis">
            {task.description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-6 text-muted-foreground text-sm font-medium">
          {task.dueDate && (
            <div className="flex items-center gap-2">
              <Icon as="IconCalendar" size={16} />
              {tasksPageLabels.taskCard.dueLabel} {formatDate(task.dueDate)}
            </div>
          )}
          <div className="flex items-center gap-2">
            {tasksPageLabels.taskCard.createdLabel} {formatDate(task.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
