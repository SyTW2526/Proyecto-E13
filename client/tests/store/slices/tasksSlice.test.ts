import { describe, expect, it, vi, afterEach } from "vitest";
import reducer, {
  addTask,
  addTaskShare,
  clearFilters,
  deleteTask,
  removeTaskShare,
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
  setLoading,
  setPriorityFilter,
  setSearchFilter,
  setSelectedTask,
  setSorting,
  setStatusFilter,
  setListFilter,
  setTaskStatus,
  setTasks,
  toggleSortOrder,
  toggleTaskComplete,
  updateTask,
  updateTaskShare,
} from "@/store/slices/tasksSlice";
import type { Task, TasksState } from "@/types/tasks-system/task";
import type { TaskShare } from "@/types/tasks-system/shareTask";

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

  it("setTasks reemplaza listado y reinicia flags", () => {
    const state = reducer(
      { ...initialState, isLoading: true, error: "x" },
      setTasks([baseTask]),
    );
    expect(state.tasks).toEqual([baseTask]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("addTask inserta al inicio y limpia error", () => {
    const other = { ...baseTask, id: "t2" };
    const state = reducer(
      { ...initialState, tasks: [other], error: "x" },
      addTask(baseTask),
    );
    expect(state.tasks.map((t) => t.id)).toEqual(["t1", "t2"]);
    expect(state.error).toBeNull();
  });

  it("updateTask actualiza campos existentes", () => {
    const state = reducer(
      { ...initialState, tasks: [baseTask] },
      updateTask({ id: "t1", name: "Nuevo nombre" }),
    );
    expect(state.tasks[0].name).toBe("Nuevo nombre");
  });

  it("deleteTask elimina y reinicia selectedTaskId", () => {
    const populated: TasksState = {
      ...initialState,
      tasks: [baseTask],
      selectedTaskId: "t1",
    };
    const state = reducer(populated, deleteTask("t1"));
    expect(state.tasks).toHaveLength(0);
    expect(state.selectedTaskId).toBeNull();
  });

  it("toggleTaskComplete alterna estado y fechas", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-03-01T00:00:00.000Z"));
    let state = reducer(
      { ...initialState, tasks: [baseTask] },
      toggleTaskComplete("t1"),
    );
    expect(state.tasks[0].completed).toBe(true);
    expect(state.tasks[0].status).toBe("COMPLETED");
    expect(state.tasks[0].completedAt).toBe("2024-03-01T00:00:00.000Z");

    state = reducer(state, toggleTaskComplete("t1"));
    expect(state.tasks[0].completed).toBe(false);
    expect(state.tasks[0].status).toBe("PENDING");
    expect(state.tasks[0].completedAt).toBeUndefined();
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

  it("gestiona compartidos: add/update/remove", () => {
    let state = reducer(
      { ...initialState, tasks: [{ ...baseTask, shares: [] }] },
      addTaskShare({ taskId: "t1", share }),
    );
    expect(state.tasks[0].shares).toEqual([share]);

    const updated = { ...share, permission: "EDIT" };
    state = reducer(state, updateTaskShare({ taskId: "t1", share: updated }));
    expect(state.tasks[0].shares[0]).toEqual(updated);

    state = reducer(state, removeTaskShare({ taskId: "t1", shareId: "sh1" }));
    expect(state.tasks[0].shares).toHaveLength(0);
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
      { ...baseTask, id: "t2", name: "Alquilar", status: "COMPLETED" },
      {
        ...baseTask,
        id: "t3",
        name: "Otra",
        status: "IN_PROGRESS",
        priority: "HIGH",
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
