import {
  getCompletedTasksLastNDays,
  getFavoriteTasks,
  getMostRecentTasks,
  getNextDueTasks,
} from "@/lib/taskFilters";
import type { Task } from "@/types/tasks-system/task";
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: "test-id",
  name: "Test Task",
  description: "Test description",
  status: "PENDING",
  priority: "MEDIUM",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  listId: "list-1",
  completed: false,
  shares: [],
  favorite: false,
  ...overrides,
});

describe("taskFilters", () => {
  describe("getCompletedTasksLastNDays", () => {
    it("devuelve 0 cuando no hay tareas completadas", () => {
      const tasks = [
        createTask({ completed: false }),
        createTask({ completed: false }),
      ];
      expect(getCompletedTasksLastNDays(tasks, 7)).toBe(0);
    });

    it("cuenta tareas completadas en los últimos 7 días", () => {
      const now = new Date();
      const threeDaysAgo = new Date(now);
      threeDaysAgo.setDate(now.getDate() - 3);

      const tasks = [
        createTask({
          completed: true,
          completedAt: threeDaysAgo.toISOString(),
        }),
        createTask({
          completed: true,
          completedAt: now.toISOString(),
        }),
        createTask({ completed: false }),
      ];

      expect(getCompletedTasksLastNDays(tasks, 7)).toBe(2);
    });

    it("no cuenta tareas completadas hace más de N días", () => {
      const now = new Date();
      const tenDaysAgo = new Date(now);
      tenDaysAgo.setDate(now.getDate() - 10);

      const tasks = [
        createTask({
          completed: true,
          completedAt: tenDaysAgo.toISOString(),
        }),
      ];

      expect(getCompletedTasksLastNDays(tasks, 7)).toBe(0);
    });

    it("devuelve 0 cuando days es 0 o negativo", () => {
      const tasks = [
        createTask({ completed: true, completedAt: new Date().toISOString() }),
      ];
      expect(getCompletedTasksLastNDays(tasks, 0)).toBe(0);
      expect(getCompletedTasksLastNDays(tasks, -5)).toBe(0);
    });

    it("maneja fechas inválidas correctamente", () => {
      const tasks = [
        createTask({ completed: true, completedAt: "invalid-date" }),
      ];
      expect(getCompletedTasksLastNDays(tasks, 7)).toBe(0);
    });

    it("devuelve 0 cuando el array de tareas está vacío", () => {
      expect(getCompletedTasksLastNDays([], 7)).toBe(0);
    });

    it("maneja tareas completadas sin campo completedAt", () => {
      const tasks = [createTask({ completed: true, completedAt: undefined })];
      expect(getCompletedTasksLastNDays(tasks, 7)).toBe(0);
    });

    it("cuenta correctamente en el límite exacto del período", () => {
      const now = new Date();
      const sixDaysAgo = new Date(now);
      sixDaysAgo.setDate(now.getDate() - 6);

      const tasks = [
        createTask({
          completed: true,
          completedAt: sixDaysAgo.toISOString(),
        }),
      ];

      expect(getCompletedTasksLastNDays(tasks, 7)).toBe(1);
    });
  });

  describe("getNextDueTasks", () => {
    it("devuelve tareas ordenadas por fecha de vencimiento", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const tasks = [
        createTask({ id: "1", dueDate: nextWeek.toISOString() }),
        createTask({ id: "2", dueDate: tomorrow.toISOString() }),
      ];

      const result = getNextDueTasks(tasks, 5);
      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("1");
    });

    it("no incluye tareas sin fecha de vencimiento", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tasks = [
        createTask({ id: "1", dueDate: undefined }),
        createTask({ id: "2", dueDate: tomorrow.toISOString() }),
      ];

      const result = getNextDueTasks(tasks, 5);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("2");
    });

    it("no incluye tareas vencidas (pasadas)", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const tasks = [createTask({ dueDate: yesterday.toISOString() })];

      expect(getNextDueTasks(tasks, 5)).toHaveLength(0);
    });

    it("limita resultados según el parámetro limit", () => {
      const tasks = Array.from({ length: 10 }, (_, i) => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + i + 1);
        return createTask({
          id: `task-${i}`,
          dueDate: futureDate.toISOString(),
        });
      });

      expect(getNextDueTasks(tasks, 3)).toHaveLength(3);
      expect(getNextDueTasks(tasks, 5)).toHaveLength(5);
    });

    it("maneja fechas inválidas", () => {
      const tasks = [createTask({ dueDate: "invalid-date" })];
      expect(getNextDueTasks(tasks, 5)).toHaveLength(0);
    });

    it("devuelve array vacío cuando no hay tareas", () => {
      expect(getNextDueTasks([], 5)).toHaveLength(0);
    });

    it("incluye tareas que vencen en el futuro inmediato", () => {
      const soon = new Date();
      soon.setMinutes(soon.getMinutes() + 5);

      const tasks = [createTask({ dueDate: soon.toISOString() })];

      const result = getNextDueTasks(tasks, 5);
      expect(result).toHaveLength(1);
    });
  });

  describe("getMostRecentTasks", () => {
    it("devuelve tareas ordenadas de más nueva a más antigua", () => {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      const tasks = [
        createTask({ id: "1", createdAt: yesterday.toISOString() }),
        createTask({ id: "2", createdAt: now.toISOString() }),
      ];

      const result = getMostRecentTasks(tasks, 5);
      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("1");
    });

    it("limita resultados según el parámetro limit", () => {
      const tasks = Array.from({ length: 10 }, (_, i) =>
        createTask({ id: `task-${i}` }),
      );

      expect(getMostRecentTasks(tasks, 3)).toHaveLength(3);
      expect(getMostRecentTasks(tasks, 5)).toHaveLength(5);
    });

    it("maneja fechas inválidas usando época 0", () => {
      const tasks = [
        createTask({ id: "1", createdAt: "invalid-date" }),
        createTask({ id: "2", createdAt: new Date().toISOString() }),
      ];

      const result = getMostRecentTasks(tasks, 5);
      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("1");
    });
  });

  describe("getFavoriteTasks", () => {
    it("devuelve solo tareas marcadas como favoritas", () => {
      const tasks = [
        createTask({ id: "1", favorite: true }),
        createTask({ id: "2", favorite: false }),
        createTask({ id: "3", favorite: true }),
      ];

      const result = getFavoriteTasks(tasks);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("3");
    });

    it("devuelve array vacío cuando no hay favoritas", () => {
      const tasks = [
        createTask({ favorite: false }),
        createTask({ favorite: false }),
      ];

      expect(getFavoriteTasks(tasks)).toHaveLength(0);
    });

    it("devuelve array vacío cuando no hay tareas", () => {
      expect(getFavoriteTasks([])).toHaveLength(0);
    });
  });
});
