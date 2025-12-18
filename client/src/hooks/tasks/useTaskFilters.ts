import { useMemo } from "react";
import { useTasks } from "./useTasks";
import { useLists } from "@/hooks/useLists";

type ListMode = "owned" | "shared" | "all";

export function useTaskFilters(listMode: ListMode = "all") {
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
  const { accessibleLists, ownedLists, sharedLists } = useLists();

  const listsToUse = useMemo(() => {
    switch (listMode) {
      case "owned":
        return ownedLists;
      case "shared":
        return sharedLists;
      case "all":
      default:
        return accessibleLists;
    }
  }, [listMode, ownedLists, sharedLists, accessibleLists]);

  const selectedListId = filters.listId;
  const listTaskCounts = useMemo(
    () =>
      listsToUse.map((list) => ({
        id: list.id,
        name: list.name,
        count: accessibleTasks.filter((task) => task.listId === list.id).length,
        description: list.description,
        owner: list.owner,
      })),
    [listsToUse, accessibleTasks],
  );

  const handleListFilter = (listId: string | null) => {
    filterByList(listId);
  };

  return {
    displayTasks: filteredTasks,
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
    accessibleLists: listsToUse,
  };
}
