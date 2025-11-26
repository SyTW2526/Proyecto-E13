import { useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useLists } from "@/hooks/useLists";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { TaskCard } from "@/components/tasks/TaskCard";
import { FilterableList } from "@/components/tasks/FilterableList";
import {
  priorityConfig,
  statusConfig,
  tasksPageLabels,
} from "@/config/taskConfig";
import CreateTaskDialog from "@/components/createDialogs/createTaskDialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task, TaskPriority, TaskStatus } from "@/types/tasks-system/task";

export default function TasksPage() {
  const {
    displayTasks,
    listTaskCounts,
    selectedListId,
    handleListFilter,
    accessibleLists,
    filterByStatus,
    filterByPriority,
    filters,
    sortBy,
    toggleSort,
    sorting,
  } = useTaskFilters();

  const { fetchAllTasks, isLoading } = useTasks();
  const { fetchAllLists, isLoading: isLoadingLists } = useLists();

  useEffect(() => {
    fetchAllTasks();
    fetchAllLists();
  }, []);

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
    <div className="max-w-(--breakpoint-xl) mx-auto py-10 lg:py-16 px-6 xl:px-0 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
      <aside className="sticky top-8 shrink-0 lg:max-w-xs w-full space-y-8 order-1 lg:order-2 lg:border-l lg:border-border/40 lg:pl-12">
        <FilterableList
          title={tasksPageLabels.sidebar.title}
          items={listTaskCounts}
          selectedId={selectedListId}
          onItemClick={handleListFilter}
          emptyMessage={tasksPageLabels.sidebar.emptyState}
          icon={tasksPageLabels.createButtons.list.icon}
          isLoading={isLoadingLists}
        />
      </aside>

      <div className="flex-1 order-2 lg:order-1 w-full">
        <div className="mb-6 space-y-4">
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90">
                {tasksPageLabels.title}
              </h1>
            </div>
            <div className="flex gap-2">
              {/* Boton de crear tareas */}
              <CreateTaskDialog>
                <Button leftIcon={tasksPageLabels.createButtons.task.icon} />
              </CreateTaskDialog>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            <Select
              value={filters.status}
              onValueChange={(value) =>
                filterByStatus(value as "all" | TaskStatus)
              }
            >
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.priority}
              onValueChange={(value) =>
                filterByPriority(value as "all" | TaskPriority)
              }
            >
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                {Object.entries(priorityConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Ordenar */}
            <div className="flex items-center gap-2 ml-auto">
              <Select
                value={sorting.field}
                onValueChange={(value) =>
                  sortBy(
                    value as
                      | "name"
                      | "dueDate"
                      | "priority"
                      | "createdAt"
                      | "updatedAt",
                    sorting.order,
                  )
                }
              >
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Fecha de vencimiento</SelectItem>
                  <SelectItem value="createdAt">Fecha de creación</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleSort}
                title={
                  sorting.order === "asc"
                    ? "Orden ascendente"
                    : "Orden descendente"
                }
              >
                <Icon
                  as={
                    sorting.order === "asc"
                      ? "IconSortAscending"
                      : "IconSortDescending"
                  }
                  size={16}
                />
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-md border p-4 h-[160px] animate-pulse bg-muted/20"
              >
                <div className="h-6 w-1/3 bg-muted rounded mb-4" />
                <div className="h-4 w-2/3 bg-muted rounded mb-2" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : displayTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {tasksPageLabels.emptyState}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayTasks.map((task: Task) => {
              const list = accessibleLists.find(
                (list) => list.id === task.listId,
              );
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  list={list}
                  formatDate={formatDate}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
