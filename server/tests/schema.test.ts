import { describe, it, expect } from "vitest";
import {
  createUserSchema,
  createTaskSchema,
  updateTaskSchema,
  getTasksQuerySchema,
  TaskStatus,
  Priority,
} from "../src/schemas/schema";

describe("Zod schemas - basic behavior", () => {
  it("createUserSchema acepta datos válidos", () => {
    const data = {
      name: "Alice",
      email: "alice@example.com",
      password: "secret12",
    };
    const parsed = createUserSchema.parse(data);
    expect(parsed).toMatchObject({ name: "Alice", email: "alice@example.com" });
  });

  it("createUserSchema rechaza email inválido", () => {
    const data = { name: "Bob", email: "nope", password: "secret12" };
    expect(() => createUserSchema.parse(data)).toThrow();
  });

  it("createTaskSchema acepta datos mínimos válidos", () => {
    // UUIDs con versión/variante válidas (v4-like)
    const data = {
      name: "Tarea 1",
      categoryId: "00000000-0000-4000-8000-000000000001",
    };
    const parsed = createTaskSchema.parse(data);
    expect(parsed.name).toBe("Tarea 1");
    expect(parsed.categoryId).toBe("00000000-0000-4000-8000-000000000001");
  });

  it("createTaskSchema rechaza categoryId inválido", () => {
    const data = { name: "Tarea 2", categoryId: "not-a-uuid" };
    expect(() => createTaskSchema.parse(data)).toThrow();
  });

  it("updateTaskSchema permite campos parciales y completed boolean", () => {
    const data = { completed: true };
    const parsed = updateTaskSchema.parse(data);
    expect(parsed.completed).toBe(true);
  });

  it("getTasksQuerySchema acepta status y categoryId válidos", () => {
    const q = {
      status: "PENDING",
      categoryId: "00000000-0000-4000-8000-000000000002",
    };
    const parsed = getTasksQuerySchema.parse(q);
    expect(parsed.status).toBe("PENDING");
    expect(parsed.categoryId).toBe("00000000-0000-4000-8000-000000000002");
  });

  it("TaskStatus y Priority aceptan valores esperados", () => {
    expect(TaskStatus.parse("IN_PROGRESS")).toBe("IN_PROGRESS");
    expect(Priority.parse("URGENT")).toBe("URGENT");
  });
});
