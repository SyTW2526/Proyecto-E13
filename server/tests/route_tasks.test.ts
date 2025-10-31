import { vi, describe, it, expect, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

// Mock del controlador para evitar interacción con prisma en estas pruebas de enrutado
vi.mock("../src/controllers/tasks", () => ({
  createTask: vi.fn((req: any, res: any) =>
    res.status(201).json({ ok: true, route: "create" }),
  ),
  getTasks: vi.fn((req: any, res: any) =>
    res.status(200).json({ ok: true, route: "list" }),
  ),
  getTaskById: vi.fn((req: any, res: any) =>
    res.status(200).json({ ok: true, route: "getById", id: req.params.id }),
  ),
  updateTask: vi.fn((req: any, res: any) =>
    res.status(200).json({ ok: true, route: "updateById", id: req.params.id }),
  ),
  deleteTask: vi.fn((req: any, res: any) =>
    res.status(200).json({ ok: true, route: "deleteById", id: req.params.id }),
  ),
}));

import router from "../src/routes/route";

describe("router /tasks - wiring", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // montar el router en /api como en server.ts
    app.use("/api", router);
  });

  it("POST /api/tasks -> 201", async () => {
    const res = await request(app).post("/api/tasks").send({ name: "x" });
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.route).toBe("create");
  });

  it("GET /api/tasks -> 200", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("list");
  });

  it("GET /api/tasks/:id -> 200 and returns id", async () => {
    const res = await request(app).get("/api/tasks/123");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getById");
    expect(res.body.id).toBe("123");
  });

  it("PATCH /api/tasks/:id -> 200 and returns id", async () => {
    const res = await request(app).patch("/api/tasks/321");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("updateById");
    expect(res.body.id).toBe("321");
  });

  it("DELETE /api/tasks/:id -> 200 and returns id", async () => {
    const res = await request(app).delete("/api/tasks/321");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("deleteById");
    expect(res.body.id).toBe("321");
  });
});
