import reducer, {
  clearFilters,
  createTask,
  deleteTask,
  fetchSharedTasks,
  fetchTasks,
  resetTasksState,
  selectFilteredTasks,
  selectSelectedTask,
  selectTaskById,
  selectTaskFilters,
  selectTaskSorting,
  selectTasks,
  selectTasksByListId,
  selectTasksByPriority,
  selectTasksByStatus,
  setError,
  setListFilter,
  setLoading,
  setPriorityFilter,
  setSearchFilter,
  setSelectedTask,
  setSorting,
  setStatusFilter,
  setTaskStatus,
  shareTask,
  toggleSortOrder,
  unshareTask,
  updateTask,
  updateTaskSharePermission,
} from "@/store/slices/tasksSlice";
import type { Task, TaskShare, TasksState } from "@/types/tasks-system/task";
import { afterEach, describe, expect, it, vi } from "vitest";

const baseTask: Task = {
  id: "t1",
  name: "Comprar",
  description: "ir al super",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: "2024-02-01",
  completedAt: undefined,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-05",
  listId: "l1",
  completed: false,
  shares: [],
  favorite: false,
};

const share: TaskShare = {
  id: "sh1",
  permission: "VIEW",
  taskId: "t1",
  userId: "u1",
};

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
  sorting: { field: "createdAt", order: "desc" },
};

afterEach(() => {
  vi.useRealTimers();
});

describe("tasksSlice reducer", () => {
  it("setLoading y setError", () => {
    let state = reducer(initialState, setLoading(true));
    expect(state.isLoading).toBe(true);

    state = reducer(state, setError("err"));
    expect(state.error).toBe("err");
    expect(state.isLoading).toBe(false);
  });

  it("fetchTasks.fulfilled reemplaza listado y reinicia flags", () => {
    const action = {
      type: fetchTasks.fulfilled.type,
      payload: [baseTask],
    };
    const state = reducer(
      { ...initialState, isLoading: true, error: "x" },
      action,
    );
    expect(state.tasks).toEqual([baseTask]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("createTask.fulfilled inserta al inicio y limpia error", () => {
    const other = { ...baseTask, id: "t2" };
    const action = {
      type: createTask.fulfilled.type,
      payload: baseTask,
    };
    const state = reducer(
      { ...initialState, tasks: [other], error: "x" },
      action,
    );
    expect(state.tasks.map((t) => t.id)).toEqual(["t1", "t2"]);
    expect(state.error).toBeNull();
  });

  it("updateTask.fulfilled actualiza campos existentes", () => {
    const action = {
      type: updateTask.fulfilled.type,
      payload: { ...baseTask, name: "Nuevo nombre" },
    };
    const state = reducer({ ...initialState, tasks: [baseTask] }, action);
    expect(state.tasks[0].name).toBe("Nuevo nombre");
  });

  it("deleteTask.fulfilled elimina y reinicia selectedTaskId", () => {
    const populated: TasksState = {
      ...initialState,
      tasks: [baseTask],
      selectedTaskId: "t1",
    };
    const action = {
      type: deleteTask.fulfilled.type,
      payload: "t1",
    };
    const state = reducer(populated, action);
    expect(state.tasks).toHaveLength(0);
    expect(state.selectedTaskId).toBeNull();
  });

  it("setTaskStatus ajusta status y completed/completedAt", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-03-02T00:00:00.000Z"));
    let state = reducer(
      { ...initialState, tasks: [baseTask] },
      setTaskStatus({ id: "t1", status: "COMPLETED" }),
    );
    expect(state.tasks[0].completed).toBe(true);
    expect(state.tasks[0].completedAt).toBe("2024-03-02T00:00:00.000Z");

    state = reducer(state, setTaskStatus({ id: "t1", status: "IN_PROGRESS" }));
    expect(state.tasks[0].completed).toBe(false);
    expect(state.tasks[0].completedAt).toBeUndefined();
    expect(state.tasks[0].status).toBe("IN_PROGRESS");
  });

  it("actualiza filtros y sorting, y los restablece con clearFilters/toggleSortOrder", () => {
    let state = reducer(initialState, setStatusFilter("PENDING"));
    state = reducer(state, setListFilter("l1"));
    state = reducer(state, setSearchFilter("comprar"));
    state = reducer(state, setPriorityFilter("HIGH"));
    state = reducer(state, setSorting({ field: "name", order: "asc" }));
    expect(selectTaskFilters({ tasks: state }).status).toBe("PENDING");
    expect(selectTaskFilters({ tasks: state }).listId).toBe("l1");
    expect(selectTaskFilters({ tasks: state }).search).toBe("comprar");
    expect(selectTaskFilters({ tasks: state }).priority).toBe("HIGH");
    expect(selectTaskSorting({ tasks: state }).order).toBe("asc");

    state = reducer(state, toggleSortOrder());
    expect(selectTaskSorting({ tasks: state }).order).toBe("desc");

    state = reducer(state, clearFilters());
    expect(selectTaskFilters({ tasks: state })).toEqual(initialState.filters);
  });

  it("setSelectedTask guarda id", () => {
    const state = reducer(initialState, setSelectedTask("t1"));
    expect(state.selectedTaskId).toBe("t1");
  });

  it("resetTasksState vuelve al inicial", () => {
    const dirty: TasksState = {
      ...initialState,
      tasks: [baseTask],
      selectedTaskId: "t1",
      isLoading: true,
      error: "x",
      filters: { ...initialState.filters, status: "PENDING" },
    };
    const state = reducer(dirty, resetTasksState());
    expect(state).toEqual(initialState);
  });
});

describe("tasksSlice selectors", () => {
  const wrap = (tasks: TasksState) => ({ tasks });

  it("selectTasks y selectSelectedTask", () => {
    const state = wrap({
      ...initialState,
      tasks: [baseTask],
      selectedTaskId: "t1",
    });
    expect(selectTasks(state)).toEqual([baseTask]);
    expect(selectSelectedTask(state)).toEqual(baseTask);
  });

  it("selectTaskById retorna coincidencia", () => {
    const state = wrap({
      ...initialState,
      tasks: [baseTask, { ...baseTask, id: "t2" }],
    });
    expect(selectTaskById("t2")(state)?.id).toBe("t2");
  });

  it("selectTasksByListId filtra por lista", () => {
    const state = wrap({
      ...initialState,
      tasks: [
        baseTask,
        { ...baseTask, id: "t2", listId: "l2" },
        { ...baseTask, id: "t3", listId: "l1" },
      ],
    });
    expect(selectTasksByListId("l1")(state)).toHaveLength(2);
    expect(selectTasksByListId("l2")(state)).toHaveLength(1);
  });

  it("selectFilteredTasks aplica filtros y ordenamiento", () => {
    const tasks = [
      baseTask,
      { ...baseTask, id: "t2", name: "Alquilar", status: "COMPLETED" as const },
      {
        ...baseTask,
        id: "t3",
        name: "Otra",
        status: "IN_PROGRESS" as const,
        priority: "HIGH" as const,
        description: "algo especial",
      },
    ];
    const state: TasksState = {
      ...initialState,
      tasks,
      filters: {
        status: "IN_PROGRESS",
        listId: "l1",
        search: "algo",
        priority: "HIGH",
      },
      sorting: { field: "name", order: "asc" },
    };
    const result = selectFilteredTasks({ tasks: state });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("t3");
  });

  it("selectTasksByStatus y selectTasksByPriority cuentan correctamente", () => {
    const state = wrap({
      ...initialState,
      tasks: [
        baseTask,
        { ...baseTask, id: "t2", status: "COMPLETED", completed: true },
        { ...baseTask, id: "t3", status: "IN_PROGRESS", priority: "HIGH" },
        { ...baseTask, id: "t4", priority: "URGENT" },
      ],
    });
    const statusCounts = selectTasksByStatus(state);
    expect(statusCounts).toEqual({
      pending: 2,
      inProgress: 1,
      completed: 1,
      total: 4,
    });

    const priorityCounts = selectTasksByPriority(state);
    expect(priorityCounts).toEqual({
      low: 0,
      medium: 2,
      high: 1,
      urgent: 1,
    });
  });
});

describe("tasksSlice - Acciones asíncronas adicionales", () => {
  it("fetchSharedTasks.fulfilled reemplaza las tareas", () => {
    const sharedTask = { ...baseTask, id: "t-shared" };
    const action = {
      type: fetchSharedTasks.fulfilled.type,
      payload: [sharedTask],
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.tasks).toEqual([sharedTask]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("fetchSharedTasks.rejected establece error", () => {
    const action = {
      type: fetchSharedTasks.rejected.type,
      payload: "Error al cargar tareas compartidas",
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.error).toBe("Error al cargar tareas compartidas");
    expect(state.isLoading).toBe(false);
  });

  it("shareTask.fulfilled actualiza la tarea con shares", () => {
    const updatedTask = {
      ...baseTask,
      shares: [share],
    };
    const action = {
      type: shareTask.fulfilled.type,
      payload: updatedTask,
    };
    const state = reducer({ ...initialState, tasks: [baseTask] }, action);
    expect(state.tasks[0].shares).toEqual([share]);
    expect(state.error).toBeNull();
  });

  it("shareTask.rejected establece error", () => {
    const action = {
      type: shareTask.rejected.type,
      payload: "Error al compartir tarea",
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe("Error al compartir tarea");
  });

  it("updateTaskSharePermission.pending actualiza optimísticamente", () => {
    const taskWithShare = {
      ...baseTask,
      shares: [{ ...share, permission: "VIEW" as const }],
    };
    const action = {
      type: updateTaskSharePermission.pending.type,
      meta: {
        arg: { taskId: "t1", userId: "u1", permission: "EDIT" },
      },
    };
    const state = reducer({ ...initialState, tasks: [taskWithShare] }, action);
    expect(state.tasks[0].shares?.[0].permission).toBe("EDIT");
  });

  it("updateTaskSharePermission.fulfilled actualiza la tarea", () => {
    const updatedTask = {
      ...baseTask,
      shares: [{ ...share, permission: "EDIT" as const }],
    };
    const action = {
      type: updateTaskSharePermission.fulfilled.type,
      payload: updatedTask,
    };
    const state = reducer({ ...initialState, tasks: [baseTask] }, action);
    expect(state.tasks[0].shares?.[0].permission).toBe("EDIT");
  });

  it("updateTaskSharePermission.rejected establece error", () => {
    const action = {
      type: updateTaskSharePermission.rejected.type,
      payload: "Error al actualizar permisos",
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe("Error al actualizar permisos");
  });

  it("unshareTask.fulfilled elimina el share de la tarea", () => {
    const taskWithoutShare = { ...baseTask, shares: [] };
    const action = {
      type: unshareTask.fulfilled.type,
      payload: taskWithoutShare,
    };
    const state = reducer(
      { ...initialState, tasks: [{ ...baseTask, shares: [share] }] },
      action,
    );
    expect(state.tasks[0].shares).toEqual([]);
  });

  it("unshareTask.rejected establece error", () => {
    const action = {
      type: unshareTask.rejected.type,
      payload: "Error al dejar de compartir",
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe("Error al dejar de compartir");
  });

  it("fetchTasks.pending establece isLoading", () => {
    const action = { type: fetchTasks.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("fetchTasks.rejected establece error", () => {
    const action = {
      type: fetchTasks.rejected.type,
      payload: "Error de red",
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.error).toBe("Error de red");
    expect(state.isLoading).toBe(false);
  });

  it("createTask.pending limpia error", () => {
    const action = { type: createTask.pending.type };
    const state = reducer({ ...initialState, error: "Error previo" }, action);
    expect(state.error).toBeNull();
  });

  it("createTask.rejected establece error", () => {
    const action = {
      type: createTask.rejected.type,
      payload: "Error al crear tarea",
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.error).toBe("Error al crear tarea");
    expect(state.isLoading).toBe(false);
  });

  it("updateTask.pending limpia error", () => {
    const action = { type: updateTask.pending.type };
    const state = reducer({ ...initialState, error: "Error previo" }, action);
    expect(state.error).toBeNull();
  });

  it("updateTask.rejected establece error", () => {
    const action = {
      type: updateTask.rejected.type,
      payload: "Error al actualizar",
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe("Error al actualizar");
  });

  it("deleteTask.pending limpia error", () => {
    const action = { type: deleteTask.pending.type };
    const state = reducer({ ...initialState, error: "Error previo" }, action);
    expect(state.error).toBeNull();
  });

  it("deleteTask.rejected establece error", () => {
    const action = {
      type: deleteTask.rejected.type,
      payload: "Error al eliminar",
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.error).toBe("Error al eliminar");
    expect(state.isLoading).toBe(false);
  });

  it("fetchSharedTasks.pending establece isLoading", () => {
    const action = { type: fetchSharedTasks.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("shareTask.pending limpia error", () => {
    const action = { type: shareTask.pending.type };
    const state = reducer({ ...initialState, error: "old error" }, action);
    expect(state.error).toBeNull();
  });

  it("unshareTask.pending limpia error", () => {
    const action = { type: unshareTask.pending.type };
    const state = reducer({ ...initialState, error: "old error" }, action);
    expect(state.error).toBeNull();
  });
});
