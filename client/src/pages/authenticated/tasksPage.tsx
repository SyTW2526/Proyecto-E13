import { useTaskFilters } from "@/hooks/useTaskFilters";
import { TaskCard } from "@/components/tasks/TaskCard";
import { FilterableList } from "@/components/tasks/FilterableList";
import { tasksPageLabels } from "@/config/taskConfig";

export default function TasksPage() {
  const {
    displayTasks,
    categoryTaskCounts,
    listCategoryCounts,
    selectedListId,
    selectedCategoryId,
    handleListFilter,
    handleCategoryFilter,
    accessibleCategories,
  } = useTaskFilters();

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
            {displayTasks.length}{" "}
            {displayTasks.length === 1
              ? tasksPageLabels.taskCount.singular
              : tasksPageLabels.taskCount.plural}{" "}
            {tasksPageLabels.taskCount.suffix}
          </p>
        </div>

        {displayTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {tasksPageLabels.emptyState}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayTasks.map((task) => {
              const category = accessibleCategories.find(
                (cat) => cat.id === task.categoryId,
              );
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={category}
                  formatDate={formatDate}
                />
              );
            })}
          </div>
        )}
      </div>

      <aside className="sticky top-8 shrink-0 lg:max-w-sm w-full space-y-8">
        <FilterableList
          title="Listas"
          items={listCategoryCounts}
          selectedId={selectedListId}
          onItemClick={handleListFilter}
          emptyMessage="No hay listas disponibles"
          icon="IconList"
        />

        <FilterableList
          title={tasksPageLabels.sidebar.title}
          items={categoryTaskCounts}
          selectedId={selectedCategoryId}
          onItemClick={handleCategoryFilter}
          emptyMessage={tasksPageLabels.sidebar.emptyState}
          icon="IconFolder"
        />
      </aside>
    </div>
  );
}
