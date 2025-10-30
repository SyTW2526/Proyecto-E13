import { vi, describe, it, expect, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

// Mock del controlador para evitar interacción con prisma en estas pruebas de enrutado
vi.mock("../controllers/controller", () => ({
  createTestUser: vi.fn((req: any, res: any) =>
    res.status(201).json({ ok: true, route: "create" }),
  ),
  getTestUsers: vi.fn((req: any, res: any) =>
    res.status(200).json({ ok: true, route: "list" }),
  ),
  getTestUserById: vi.fn((req: any, res: any) =>
    res.status(200).json({ ok: true, route: "getById", id: req.params.id }),
  ),
  deleteTestUserById: vi.fn((req: any, res: any) =>
    res.status(200).json({ ok: true, route: "deleteById", id: req.params.id }),
  ),
  deleteTestUsers: vi.fn((req: any, res: any) =>
    res.status(200).json({ ok: true, route: "deleteAll" }),
  ),
}));

import router from "./route";

describe("router /users - wiring", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // montar el router en /api como en server.ts
    app.use("/api", router);
  });

  it("POST /api/users -> 201", async () => {
    const res = await request(app).post("/api/users").send({ name: "x" });
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.route).toBe("create");
  });

  it("GET /api/users -> 200", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("list");
  });

  it("GET /api/users/:id -> 200 and returns id", async () => {
    const res = await request(app).get("/api/users/123");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getById");
    expect(res.body.id).toBe("123");
  });

  it("DELETE /api/users/:id -> 200 and returns id", async () => {
    const res = await request(app).delete("/api/users/321");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("deleteById");
    expect(res.body.id).toBe("321");
  });

  it("DELETE /api/users -> 200", async () => {
    const res = await request(app).delete("/api/users");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("deleteAll");
  });
});
