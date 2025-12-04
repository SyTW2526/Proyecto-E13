import { ReactNode } from "react";
import { FilterableList } from "@/components/tasks/FilterableList";
import {
  TaskStatusFilter,
  TaskPriorityFilter,
  TaskSortFilter,
} from "@/components/tasks/TaskFilters";
import { useUI } from "@/hooks/useUI";
import { Task, TaskStatus, TaskPriority } from "@/types/tasks-system/task";

type SortField = "name" | "dueDate" | "priority" | "createdAt" | "updatedAt";

interface TasksPageLayoutProps {
  title: string;
  headerActions?: ReactNode;

  // Sidebar props
  sidebarTitle: string;
  sidebarActions?: boolean;
  sidebarItems: Array<{
    id: string;
    name: string;
    count: number;
    description?: string;
  }>;
  selectedListId: string | null;
  onListClick: (id: string | null) => void;
  isSidebarLoading: boolean;
  sidebarEmptyMessage: string;

  // Filter props
  filters: { status: TaskStatus | "all"; priority: TaskPriority | "all" };
  onStatusChange: (status: TaskStatus | "all") => void;
  onPriorityChange: (priority: TaskPriority | "all") => void;
  sorting: { field: SortField; order: "asc" | "desc" };
  onSortChange: (field: SortField) => void;
  onToggleSort: () => void;

  // Content props
  isLoadingTasks: boolean;
  tasks: Task[];
  renderCard: (task: Task) => ReactNode;
  emptyTasksMessage: string;
}

export function TasksPageLayout({
  title,
  headerActions,
  sidebarTitle,
  sidebarActions,
  sidebarItems,
  selectedListId,
  onListClick,
  isSidebarLoading,
  sidebarEmptyMessage,
  filters,
  onStatusChange,
  onPriorityChange,
  sorting,
  onSortChange,
  onToggleSort,
  isLoadingTasks,
  tasks,
  renderCard,
  emptyTasksMessage,
}: TasksPageLayoutProps) {
  const { sidebarWidth } = useUI();

  const layoutConfig = {
    compact: {
      sidebar: "lg:w-64",
      grid: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4",
      skeletonCount: 8,
    },
    normal: {
      sidebar: "lg:w-80",
      grid: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3",
      skeletonCount: 6,
    },
    wide: {
      sidebar: "lg:w-96",
      grid: "grid-cols-1 lg:grid-cols-2",
      skeletonCount: 4,
    },
  }[sidebarWidth];

  return (
    <div className="container mx-auto py-8 px-4 lg:px-8 flex flex-col lg:flex-row items-start gap-8">
      <aside
        className={`w-full shrink-0 order-1 lg:order-2 ${layoutConfig.sidebar} space-y-8`}
      >
        <FilterableList
          title={sidebarTitle}
          items={sidebarItems}
          selectedId={selectedListId}
          onItemClick={onListClick}
          emptyMessage={sidebarEmptyMessage}
          icon="IconList"
          isLoading={isSidebarLoading}
          showAddButton={sidebarActions}
        />
      </aside>

      

      <div className="flex-1 min-w-0 w-full order-2 lg:order-1">
        <div className="mb-6 space-y-4">
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90">
                {title}
              </h1>
            </div>
            {headerActions && <div className="flex gap-2">{headerActions}</div>}
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 items-center justify-between bg-card p-2 rounded-lg border border-border">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <TaskStatusFilter
                value={filters.status}
                onChange={onStatusChange}
                className="w-full"
              />

              <TaskPriorityFilter
                value={filters.priority}
                onChange={onPriorityChange}
                className="w-full"
              />
            </div>

            <div>
              <TaskSortFilter
                sortField={sorting.field}
                sortOrder={sorting.order}
                onSortFieldChange={(field) => onSortChange(field)}
                onToggleOrder={onToggleSort}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {isLoadingTasks ? (
          <div className={`grid ${layoutConfig.grid} gap-6`}>
            {[...Array(layoutConfig.skeletonCount)].map((_, i) => (
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
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{emptyTasksMessage}</p>
          </div>
        ) : (
          <div className={`grid ${layoutConfig.grid} gap-6`}>
            {tasks.map((task) => renderCard(task))}
          </div>
        )}
      </div>
    </div>
  );
}
