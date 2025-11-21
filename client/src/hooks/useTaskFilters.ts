import { useState, useMemo } from "react";
import { useTasks } from "./useTasks";
import { useCategories } from "./useCategories";
import { useLists } from "./useLists";

export function useTaskFilters() {
  const { accessibleTasks, filteredTasks, filterByCategory, filters } =
    useTasks();
  const { accessibleCategories } = useCategories();
  const { accessibleLists } = useLists();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Filtrar categorías por lista seleccionada
  const filteredCategories = useMemo(
    () =>
      selectedListId
        ? accessibleCategories.filter((cat) => cat.listId === selectedListId)
        : accessibleCategories,
    [selectedListId, accessibleCategories],
  );

  // Determinar qué tareas mostrar
  const displayTasks = useMemo(() => {
    if (filters.categoryId) {
      return filteredTasks;
    }
    if (selectedListId) {
      return accessibleTasks.filter((task) => {
        const category = accessibleCategories.find(
          (cat) => cat.id === task.categoryId,
        );
        return category?.listId === selectedListId;
      });
    }
    return accessibleTasks;
  }, [
    filters.categoryId,
    selectedListId,
    filteredTasks,
    accessibleTasks,
    accessibleCategories,
  ]);

  // Contar tareas por categoría
  const categoryTaskCounts = useMemo(
    () =>
      filteredCategories.map((category) => ({
        id: category.id,
        name: category.name,
        count: accessibleTasks.filter((task) => task.categoryId === category.id)
          .length,
      })),
    [filteredCategories, accessibleTasks],
  );

  // Contar categorías por lista
  const listCategoryCounts = useMemo(
    () =>
      accessibleLists.map((list) => ({
        id: list.id,
        name: list.name,
        count: accessibleCategories.filter(
          (category) => category.listId === list.id,
        ).length,
      })),
    [accessibleLists, accessibleCategories],
  );

  const handleListFilter = (listId: string | null) => {
    setSelectedListId(listId);
    filterByCategory(null); // Reset category filter when changing list
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    filterByCategory(categoryId);
  };

  return {
    displayTasks,
    categoryTaskCounts,
    listCategoryCounts,
    selectedListId,
    selectedCategoryId: filters.categoryId,
    handleListFilter,
    handleCategoryFilter,
    accessibleCategories,
  };
}
