import {
  getCompletedTasksLastNDays,
  getFavoriteTasks,
  getMostRecentTasks,
  getNextDueTasks,
} from "@/lib/taskFilters";
import {
  addTask,
  addTaskShare,
  clearFilters,
  deleteTask,
  removeTaskShare,
  selectFilteredTasks,
  selectSelectedTask,
  selectSelectedTaskId,
  selectSharedTasks,
  selectTaskFilters,
  selectTasks,
  selectTasksByCategoryId,
  selectTasksByPriority,
  selectTasksByStatus,
  selectTasksError,
  selectTasksLoading,
  selectTaskSorting,
  setCategoryFilter,
  setError,
  setLoading,
  setPriorityFilter,
  setSearchFilter,
  setSelectedTask,
  setSorting,
  setStatusFilter,
  setTasks,
  setTaskStatus,
  toggleSortOrder,
  toggleTaskComplete,
  updateTask,
  updateTaskShare,
} from "@/store/slices/tasksSlice";
import { useAppDispatch, useAppSelector } from "./useRedux";

import { selectUser } from "@/store/slices/authSlice";
import {
  canAccessTask,
  getTaskPermission,
  selectAccessibleTasks,
  selectAccessibleTasksByCategory,
} from "@/store/slices/permissionsSelectors";
import type { SharePermission } from "@/types/permissions";
import type { TaskShare } from "@/types/task/shareTask";
import type { Task, TaskPriority, TaskStatus } from "@/types/task/task";

export function useTasks(categoryId?: string) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const tasks = useAppSelector(selectTasks);
  const isLoading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);
  const selectedTaskId = useAppSelector(selectSelectedTaskId);
  const selectedTask = useAppSelector(selectSelectedTask);
  const filters = useAppSelector(selectTaskFilters);
  const sorting = useAppSelector(selectTaskSorting);
  const filteredTasks = useAppSelector(selectFilteredTasks);
  const accessibleTasks = useAppSelector(selectAccessibleTasks);
  const tasksByCategory = categoryId
    ? useAppSelector(selectTasksByCategoryId(categoryId))
    : [];
  const accessibleTasksByCategory = categoryId
    ? useAppSelector(selectAccessibleTasksByCategory(categoryId))
    : [];

  // NUEVOS DERIVADOS PARA LOS FILTROS
  const completedLastWeekCount = getCompletedTasksLastNDays(accessibleTasks, 7);
  const nextDueTasks = getNextDueTasks(accessibleTasks, 5);
  const recentTasks = getMostRecentTasks(accessibleTasks, 5);
  const favoriteTasks = getFavoriteTasks(accessibleTasks);

  const taskStats = useAppSelector(selectTasksByStatus);
  const priorityStats = useAppSelector(selectTasksByPriority);
  const sharedTasks = useAppSelector(selectSharedTasks(user?.id || ""));

  const loadTasks = (tasksData: Task[]) => dispatch(setTasks(tasksData));
  const createTask = (task: Task) => dispatch(addTask(task));
  const editTask = (data: Partial<Task> & { id: string }) =>
    dispatch(updateTask(data));
  const removeTask = (id: string) => dispatch(deleteTask(id));
  const selectTask = (id: string | null) => dispatch(setSelectedTask(id));
  const toggleComplete = (id: string) => dispatch(toggleTaskComplete(id));
  const changeStatus = (id: string, status: TaskStatus) =>
    dispatch(setTaskStatus({ id, status }));
  const filterByStatus = (status: "all" | TaskStatus) =>
    dispatch(setStatusFilter(status));
  const filterByCategory = (categoryId: string | null) =>
    dispatch(setCategoryFilter(categoryId));
  const filterBySearch = (search: string) => dispatch(setSearchFilter(search));
  const filterByPriority = (priority: "all" | TaskPriority) =>
    dispatch(setPriorityFilter(priority));
  const resetFilters = () => dispatch(clearFilters());
  const sortBy = (
    field: "name" | "dueDate" | "priority" | "createdAt" | "updatedAt",
    order: "asc" | "desc",
  ) => dispatch(setSorting({ field, order }));
  const toggleSort = () => dispatch(toggleSortOrder());
  const shareTask = (taskId: string, share: TaskShare) =>
    dispatch(addTaskShare({ taskId, share }));
  const updateShare = (taskId: string, share: TaskShare) =>
    dispatch(updateTaskShare({ taskId, share }));
  const removeShare = (taskId: string, shareId: string) =>
    dispatch(removeTaskShare({ taskId, shareId }));
  const setLoadingState = (loading: boolean) => dispatch(setLoading(loading));
  const setErrorState = (error: string | null) => dispatch(setError(error));

  const state = useAppSelector((state) => state);

  const getPermission = (taskId: string): SharePermission | null =>
    getTaskPermission(taskId)(state);
  const canAccess = (
    taskId: string,
    permission: SharePermission = "VIEW",
  ): boolean => canAccessTask(taskId, permission)(state);

  return {
    tasks,
    filteredTasks,
    accessibleTasks,
    tasksByCategory,
    accessibleTasksByCategory,
    isLoading,
    error,
    selectedTaskId,
    selectedTask,
    filters,
    sorting,
    taskStats,
    priorityStats,
    sharedTasks,
    completedLastWeekCount,
    nextDueTasks,
    recentTasks,
    favoriteTasks,
    loadTasks,
    createTask,
    editTask,
    removeTask,
    selectTask,
    toggleComplete,
    changeStatus,
    filterByStatus,
    filterByCategory,
    filterBySearch,
    filterByPriority,
    resetFilters,
    sortBy,
    toggleSort,
    shareTask,
    updateShare,
    removeShare,
    setLoadingState,
    setErrorState,
    getPermission,
    canAccess,
  };
}
