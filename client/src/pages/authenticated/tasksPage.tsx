import { useTaskFilters } from "@/hooks/useTaskFilters";
import { TaskCard } from "@/components/tasks/TaskCard";
import { FilterableList } from "@/components/tasks/FilterableList";
import { tasksPageLabels } from "@/config/taskConfig";
import CreateTaskDialog from "@/components/createDialogs/createTaskDialog";
import { CreateCategoryDialogStandalone } from "@/components/createDialogs/createCategoryDialog";
import { CreateListDialogStandalone } from "@/components/createDialogs/createListDialog";
import { Button } from "@/components/ui/button";

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
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
            <div className="flex gap-2">
              <CreateTaskDialog>
                <Button
                  leftIcon={tasksPageLabels.createButtons.task.icon}
                  text={tasksPageLabels.createButtons.task.text}
                />
              </CreateTaskDialog>
              <CreateCategoryDialogStandalone>
                <Button
                  variant="outline"
                  leftIcon={tasksPageLabels.createButtons.category.icon}
                  text={tasksPageLabels.createButtons.category.text}
                />
              </CreateCategoryDialogStandalone>
              <CreateListDialogStandalone>
                <Button
                  variant="outline"
                  leftIcon={tasksPageLabels.createButtons.list.icon}
                  text={tasksPageLabels.createButtons.list.text}
                />
              </CreateListDialogStandalone>
            </div>
          </div>
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
          icon={tasksPageLabels.createButtons.list.icon}
        />

        <FilterableList
          title={tasksPageLabels.sidebar.title}
          items={categoryTaskCounts}
          selectedId={selectedCategoryId}
          onItemClick={handleCategoryFilter}
          emptyMessage={tasksPageLabels.sidebar.emptyState}
          icon={tasksPageLabels.createButtons.category.icon}
        />
      </aside>
    </div>
  );
}
