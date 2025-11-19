import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  TasksState,
} from "@/types/task/task";
import type { TaskShare } from "@/types/task/shareTask";

const initialState: TasksState = {
  tasks: [],
  selectedTaskId: null,
  isLoading: false,
  error: null,
  filters: {
    status: "all",
    categoryId: null,
    search: "",
    priority: "all",
  },
  sorting: {
    field: "createdAt",
    order: "desc",
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
      state.error = null;
    },
    updateTask: (
      state,
      action: PayloadAction<Partial<Task> & { id: string }>,
    ) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
      state.error = null;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      if (state.selectedTaskId === action.payload) {
        state.selectedTaskId = null;
      }
      state.error = null;
    },
    toggleTaskComplete: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? "COMPLETED" : "PENDING";
        task.completedAt = task.completed
          ? new Date().toISOString()
          : undefined;
      }
    },
    setTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: TaskStatus }>,
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        if (action.payload.status === "COMPLETED") {
          task.completed = true;
          task.completedAt = new Date().toISOString();
        } else {
          task.completed = false;
          task.completedAt = undefined;
        }
      }
    },
    setSelectedTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<"all" | TaskStatus>) => {
      state.filters.status = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.categoryId = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<"all" | TaskPriority>) => {
      state.filters.priority = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        status: "all",
        categoryId: null,
        search: "",
        priority: "all",
      };
    },
    setSorting: (
      state,
      action: PayloadAction<{
        field: "name" | "dueDate" | "priority" | "createdAt";
        order: "asc" | "desc";
      }>,
    ) => {
      state.sorting = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sorting.order = state.sorting.order === "asc" ? "desc" : "asc";
    },
    addTaskShare: (
      state,
      action: PayloadAction<{ taskId: string; share: TaskShare }>,
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.shares.push(action.payload.share);
      }
    },
    updateTaskShare: (
      state,
      action: PayloadAction<{ taskId: string; share: TaskShare }>,
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        const shareIndex = task.shares.findIndex(
          (s) => s.id === action.payload.share.id,
        );
        if (shareIndex !== -1) {
          task.shares[shareIndex] = action.payload.share;
        }
      }
    },
    removeTaskShare: (
      state,
      action: PayloadAction<{ taskId: string; shareId: string }>,
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.shares = task.shares.filter(
          (s) => s.id !== action.payload.shareId,
        );
      }
    },
    resetTasksState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  setTaskStatus,
  setSelectedTask,
  setStatusFilter,
  setCategoryFilter,
  setSearchFilter,
  setPriorityFilter,
  clearFilters,
  setSorting,
  toggleSortOrder,
  addTaskShare,
  updateTaskShare,
  removeTaskShare,
  resetTasksState,
} = tasksSlice.actions;

export default tasksSlice.reducer;

export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectTasksLoading = (state: { tasks: TasksState }) =>
  state.tasks.isLoading;
export const selectTasksError = (state: { tasks: TasksState }) =>
  state.tasks.error;
export const selectSelectedTaskId = (state: { tasks: TasksState }) =>
  state.tasks.selectedTaskId;
export const selectTaskFilters = (state: { tasks: TasksState }) =>
  state.tasks.filters;
export const selectTaskSorting = (state: { tasks: TasksState }) =>
  state.tasks.sorting;

export const selectSelectedTask = (state: { tasks: TasksState }) => {
  const { tasks, selectedTaskId } = state.tasks;
  return tasks.find((task) => task.id === selectedTaskId) || null;
};

export const selectTaskById =
  (taskId: string) => (state: { tasks: TasksState }) =>
    state.tasks.tasks.find((task) => task.id === taskId) || null;

export const selectTasksByCategoryId =
  (categoryId: string) => (state: { tasks: TasksState }) =>
    state.tasks.tasks.filter((task) => task.categoryId === categoryId);

export const selectFilteredTasks = (state: { tasks: TasksState }) => {
  const { tasks, filters, sorting } = state.tasks;
  let filtered = [...tasks];

  if (filters.status !== "all") {
    filtered = filtered.filter((task) => task.status === filters.status);
  }

  if (filters.categoryId) {
    filtered = filtered.filter(
      (task) => task.categoryId === filters.categoryId,
    );
  }

  if (filters.priority !== "all") {
    filtered = filtered.filter((task) => task.priority === filters.priority);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.name.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower),
    );
  }

  filtered.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sorting.field) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "dueDate":
        aValue = a.dueDate || "";
        bValue = b.dueDate || "";
        break;
      case "priority": {
        const priorityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      }
      case "createdAt":
      default:
        aValue = a.createdAt;
        bValue = b.createdAt;
        break;
    }

    if (aValue < bValue) return sorting.order === "asc" ? -1 : 1;
    if (aValue > bValue) return sorting.order === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
};

export const selectTasksByStatus = (state: { tasks: TasksState }) => {
  const { tasks } = state.tasks;
  return {
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    total: tasks.length,
  };
};

export const selectTasksByPriority = (state: { tasks: TasksState }) => {
  const { tasks } = state.tasks;
  return {
    low: tasks.filter((t) => t.priority === "LOW").length,
    medium: tasks.filter((t) => t.priority === "MEDIUM").length,
    high: tasks.filter((t) => t.priority === "HIGH").length,
    urgent: tasks.filter((t) => t.priority === "URGENT").length,
  };
};

export const selectSharedTasks =
  (userId: string) => (state: { tasks: TasksState }) =>
    state.tasks.tasks.filter((task) =>
      task.shares.some((share) => share.userId === userId),
    );
