import { useMemo } from "react";
import { useTasks } from "./useTasks";
import { useLists } from "./useLists";

export function useTaskFilters() {
  const {
    accessibleTasks,
    filteredTasks,
    filterByList,
    filterByStatus,
    filterByPriority,
    filterByFavorite,
    filters,
    sortBy,
    toggleSort,
    sorting,
  } = useTasks();
  const { accessibleLists } = useLists();

  // Usar el listId de los filtros de Redux en lugar de estado local
  const selectedListId = filters.listId;

  // Contar tareas por lista (mostrar todas las listas, no filtrar)
  const listTaskCounts = useMemo(
    () =>
      accessibleLists.map((list) => ({
        id: list.id,
        name: list.name,
        count: accessibleTasks.filter((task) => task.listId === list.id).length,
        description: list.description,
        owner: list.owner,
      })),
    [accessibleLists, accessibleTasks],
  );

  // Determinar qué tareas mostrar
  const displayTasks = useMemo(() => {
    return filteredTasks;
  }, [filteredTasks]);

  const handleListFilter = (listId: string | null) => {
    filterByList(listId);
  };

  return {
    displayTasks,
    listTaskCounts,
    selectedListId,
    handleListFilter,
    filterByStatus,
    filterByPriority,
    filterByFavorite,
    filters,
    sortBy,
    toggleSort,
    sorting,
    accessibleLists,
  };
}
