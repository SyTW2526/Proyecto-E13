import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useTasks } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";
import {
  priorityConfig,
  statusConfig,
  tasksPageLabels,
} from "@/config/taskConfig";
import {
  IconCalendar,
  IconAlertCircle,
  IconStar,
  IconCheck,
} from "@tabler/icons-react";

export default function TasksPage() {
  const { accessibleTasks } = useTasks();
  const { accessibleCategories } = useCategories();

  // Contar tareas por categoría
  const categoryTaskCounts = accessibleCategories.map((category) => ({
    ...category,
    taskCount: accessibleTasks.filter((task) => task.categoryId === category.id)
      .length,
  }));

  const formatDate = (dateString?: string) => {
    if (!dateString) return tasksPageLabels.taskCard.noDate;
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-(--breakpoint-xl) mx-auto py-10 lg:py-16 px-6 xl:px-0 flex flex-col lg:flex-row items-start gap-12">
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {tasksPageLabels.title}
          </h1>
          <p className="text-muted-foreground mt-2">
            {accessibleTasks.length}{" "}
            {accessibleTasks.length === 1
              ? tasksPageLabels.taskCount.singular
              : tasksPageLabels.taskCount.plural}{" "}
            {tasksPageLabels.taskCount.suffix}
          </p>
        </div>

        {accessibleTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {tasksPageLabels.emptyState}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {accessibleTasks.map((task) => {
              const category = accessibleCategories.find(
                (cat) => cat.id === task.categoryId,
              );
              const priorityStyle = priorityConfig[task.priority];
              const statusStyle = statusConfig[task.status];

              return (
                <Card
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-start shadow-none overflow-hidden rounded-md border py-4"
                >
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
                        <IconAlertCircle className="h-3 w-3 mr-1" />
                        {priorityStyle.label}
                      </Badge>
                      <Badge
                        className={`${statusStyle.color} hover:${statusStyle.color} shadow-none`}
                      >
                        {task.completed && (
                          <IconCheck className="h-3 w-3 mr-1" />
                        )}
                        {statusStyle.label}
                      </Badge>
                      {task.favorite && (
                        <IconStar className="h-4 w-4 text-yellow-500 fill-yellow-500" />
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
                          <IconCalendar className="h-4 w-4" />
                          {tasksPageLabels.taskCard.dueLabel}{" "}
                          {formatDate(task.dueDate)}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {tasksPageLabels.taskCard.createdLabel}{" "}
                        {formatDate(task.createdAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <aside className="sticky top-8 shrink-0 lg:max-w-sm w-full">
        <h3 className="text-xl font-semibold tracking-tight">
          {tasksPageLabels.sidebar.title}
        </h3>
        <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
          {categoryTaskCounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {tasksPageLabels.sidebar.emptyState}
            </p>
          ) : (
            categoryTaskCounts.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-2 bg-muted p-3 rounded-md bg-opacity-15 dark:bg-opacity-25"
              >
                <div className="flex items-center gap-3">
                  <Icon as="IconFolder" size={20} />
                  <span className="font-medium">{category.name}</span>
                </div>
                <Badge className="px-1.5 rounded-full bg-foreground/7 text-foreground">
                  {category.taskCount}
                </Badge>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
