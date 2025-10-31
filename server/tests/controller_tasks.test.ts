import { vi, describe, it, expect, beforeEach } from "vitest";

// Importar el módulo a probar
import * as tasks from "../src/controllers/tasks";

// Mock de prisma (mismos paths que usa el módulo)
vi.mock("../src/database/database", () => ({
  default: {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import prisma from "../src/database/database";
import { Prisma } from "@prisma/client";

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("controller tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createTask - éxito: crea tarea", async () => {
    const req: any = { body: { name: "Tarea", categoryId: "c1" } };
    const res = mockRes();

    (prisma.task.create as unknown as any).mockResolvedValue({
      id: "t1",
      name: "Tarea",
      categoryId: "c1",
    });

    await tasks.createTask(req, res);

    expect(prisma.task.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    const payload = (res.json as any).mock.calls[0][0];
    expect(payload.task).toBeDefined();
    expect(payload.task.id).toBe("t1");
  });

  it("getTasks - devuelve lista", async () => {
    const req: any = { query: {} };
    const res = mockRes();

    (prisma.task.findMany as unknown as any).mockResolvedValue([
      { id: "t1", name: "T1" },
    ]);

    await tasks.getTasks(req, res);

    expect(prisma.task.findMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = (res.json as any).mock.calls[0][0];
    expect(payload.tasks).toHaveLength(1);
  });

  it("getTaskById - no encontrada devuelve 404", async () => {
    const req: any = { params: { id: "missing" } };
    const res = mockRes();

    (prisma.task.findUnique as unknown as any).mockResolvedValue(null);

    await tasks.getTaskById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getTaskById - devuelve tarea correctamente", async () => {
    const req: any = { params: { id: "t1" } };
    const res = mockRes();

    (prisma.task.findUnique as unknown as any).mockResolvedValue({
      id: "t1",
      name: "T1",
    });

    await tasks.getTaskById(req, res);

    expect(prisma.task.findUnique).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = (res.json as any).mock.calls[0][0];
    expect(payload.task.id).toBe("t1");
  });

  it("updateTask - P2025 devuelve 404 cuando no existe", async () => {
    const req: any = { params: { id: "nope" }, body: { name: "x" } };
    const res = mockRes();

    const OriginalKnown = (Prisma as any).PrismaClientKnownRequestError;
    class FakeKnown extends Error {
      code: string;
      constructor(message: string, code: string) {
        super(message);
        this.code = code;
      }
    }
    (Prisma as any).PrismaClientKnownRequestError = FakeKnown;

    (prisma.task.update as unknown as any).mockRejectedValue(
      new FakeKnown("Not found", "P2025"),
    );

    await tasks.updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    (Prisma as any).PrismaClientKnownRequestError = OriginalKnown;
  });

  it("updateTask - éxito: marcar completed y set completedAt", async () => {
    const req: any = { params: { id: "t1" }, body: { completed: true } };
    const res = mockRes();

    (prisma.task.update as unknown as any).mockResolvedValue({
      id: "t1",
      completed: true,
      completedAt: new Date().toISOString(),
    });

    await tasks.updateTask(req, res);

    expect(prisma.task.update).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = (res.json as any).mock.calls[0][0];
    expect(payload.task.completed).toBe(true);
    expect(payload.task.completedAt).toBeDefined();
  });

  it("deleteTask - P2025 devuelve 404 cuando no existe", async () => {
    const req: any = { params: { id: "nope" } };
    const res = mockRes();

    const OriginalKnown = (Prisma as any).PrismaClientKnownRequestError;
    class FakeKnown extends Error {
      code: string;
      constructor(message: string, code: string) {
        super(message);
        this.code = code;
      }
    }
    (Prisma as any).PrismaClientKnownRequestError = FakeKnown;

    (prisma.task.delete as unknown as any).mockRejectedValue(
      new FakeKnown("Not found", "P2025"),
    );

    await tasks.deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    (Prisma as any).PrismaClientKnownRequestError = OriginalKnown;
  });
});
