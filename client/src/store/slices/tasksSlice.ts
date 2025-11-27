import type {
  Task,
  TaskPriority,
  TasksState,
  TaskStatus,
  TaskShare,
} from "@/types/tasks-system/task";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api, apiErrorMessage } from "@/lib/api";

const initialState: TasksState = {
  tasks: [],
  selectedTaskId: null,
  isLoading: false,
  error: null,
  filters: {
    status: "all",
    listId: null,
    search: "",
    priority: "all",
  },
  sorting: {
    field: "createdAt",
    order: "desc",
  },
};

// Async Thunks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Task[]>("/tasks");
      return data;
    } catch (err) {
      return rejectWithValue(apiErrorMessage(err));
    }
  },
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      const { data } = await api.post<Task>("/tasks", taskData);
      return data;
    } catch (err) {
      return rejectWithValue(apiErrorMessage(err));
    }
  },
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    { id, ...updates }: Partial<Task> & { id: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.patch<Task>(`/tasks/${id}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(apiErrorMessage(err));
    }
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(apiErrorMessage(err));
    }
  },
);

export const toggleTaskComplete = createAsyncThunk(
  "tasks/toggleComplete",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<Task>(`/tasks/${id}/toggle-complete`);
      return data;
    } catch (err) {
      return rejectWithValue(apiErrorMessage(err));
    }
  },
);

export const toggleTaskFavorite = createAsyncThunk(
  "tasks/toggleFavorite",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<Task>(`/tasks/${id}/toggle-favorite`);
      return data;
    } catch (err) {
      return rejectWithValue(apiErrorMessage(err));
    }
  },
);

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
    setListFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.listId = action.payload;
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
        listId: null,
        search: "",
        priority: "all",
      };
    },
    setSorting: (
      state,
      action: PayloadAction<{
        field: "name" | "dueDate" | "priority" | "createdAt" | "updatedAt";
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
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Task
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Task
    builder
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        if (state.selectedTaskId === action.payload) {
          state.selectedTaskId = null;
        }
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Toggle Complete
    builder.addCase(toggleTaskComplete.fulfilled, (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });
    builder.addCase(toggleTaskFavorite.fulfilled, (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });
  },
});

export const {
  setLoading,
  setError,
  setTaskStatus,
  setSelectedTask,
  setStatusFilter,
  setListFilter,
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

export const selectTasksByListId =
  (listId: string) => (state: { tasks: TasksState }) =>
    state.tasks.tasks.filter((task) => task.listId === listId);

export const selectFilteredTasks = (state: { tasks: TasksState }) => {
  const { tasks, filters, sorting } = state.tasks;
  let filtered = [...tasks];

  if (filters.status !== "all") {
    filtered = filtered.filter((task) => task.status === filters.status);
  }

  if (filters.listId) {
    filtered = filtered.filter((task) => task.listId === filters.listId);
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
      case "updatedAt":
        aValue = a.updatedAt;
        bValue = b.updatedAt;
        break;
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
      task.shares?.some((share) => share.userId === userId),
    );
