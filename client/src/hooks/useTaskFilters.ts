import { useMemo } from "react";
import { useTasks } from "./useTasks";
import { useLists } from "./useLists";

export function useTaskFilters() {
  const { accessibleTasks, filteredTasks, filterByList, filters } = useTasks();
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
      })),
    [accessibleLists, accessibleTasks],
  );

  // Determinar qué tareas mostrar
  const displayTasks = useMemo(() => {
    // Si hay filtro de lista activo, mostrar tareas filtradas
    if (filters.listId) {
      return filteredTasks;
    }
    // Si no hay filtro, mostrar todas las tareas accesibles
    return accessibleTasks;
  }, [filters.listId, filteredTasks, accessibleTasks]);

  // Contar listas (esto parece redundante, revisar si se usa)
  const listListCounts = useMemo(
    () =>
      accessibleLists.map((list) => ({
        id: list.id,
        name: list.name,
        count: accessibleLists.filter((list) => list.id === list.id).length,
      })),
    [accessibleLists, accessibleLists],
  );

  const handleListFilter = (listId: string | null) => {
    filterByList(listId);
  };

  return {
    displayTasks,
    listTaskCounts,
    listListCounts,
    selectedListId,
    handleListFilter,
    accessibleLists,
  };
}
