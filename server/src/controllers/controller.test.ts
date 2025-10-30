import { vi, describe, it, expect, beforeEach } from "vitest";

// Import el módulo que vamos a probar
import * as controller from "./controller";

// Mock de prisma y bcrypt (mismos paths que usa el módulo)
vi.mock("../database/database", () => ({
  default: {
    user: {
      create: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

import prisma from "../database/database";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("controller usuarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createTestUser - éxito: hashea y crea usuario sin devolver password", async () => {
    const req: any = {
      body: { name: "Test", email: "a@b.com", password: "pw" },
    };
    const res = mockRes();

    (bcrypt.hash as unknown as any).mockResolvedValue("hashedpw");
    (prisma.user.create as unknown as any).mockResolvedValue({
      id: "1",
      name: "Test",
      email: "a@b.com",
      password: "hashedpw",
    });

    await controller.createTestUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("pw", 10);
    expect(prisma.user.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    const payload = (res.json as any).mock.calls[0][0];
    expect(payload.user).toBeDefined();
    expect((payload.user as any).password).toBeUndefined();
  });

  it("createTestUser - email duplicado devuelve 409", async () => {
    const req: any = {
      body: { name: "Test", email: "a@b.com", password: "pw" },
    };
    const res = mockRes();

    // Crear una clase fake que sea "instanceof" Prisma.PrismaClientKnownRequestError
    const OriginalKnown = (Prisma as any).PrismaClientKnownRequestError;
    class FakeKnown extends Error {
      code: string;
      constructor(message: string, code: string) {
        super(message);
        this.code = code;
      }
    }
    (Prisma as any).PrismaClientKnownRequestError = FakeKnown;

    (prisma.user.create as unknown as any).mockRejectedValue(
      new FakeKnown("Unique", "P2002"),
    );

    await controller.createTestUser(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    const payload = (res.json as any).mock.calls[0][0];
    expect(payload.error).toMatch(/email/i);

    // Restaurar
    (Prisma as any).PrismaClientKnownRequestError = OriginalKnown;
  });

  it("getTestUsers - devuelve lista sanitizada", async () => {
    const req: any = {};
    const res = mockRes();

    (prisma.user.findMany as unknown as any).mockResolvedValue([
      { id: "1", name: "T", email: "a@b.com", password: "secret" },
    ]);

    await controller.getTestUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const payload = (res.json as any).mock.calls[0][0];
    expect(payload.users).toHaveLength(1);
    expect((payload.users[0] as any).password).toBeUndefined();
  });

  it("deleteTestUserById - usuario no encontrado devuelve 404 (P2025)", async () => {
    const req: any = { params: { id: "1" } };
    const res = mockRes();

    const OriginalKnownDel = (Prisma as any).PrismaClientKnownRequestError;
    class FakeKnownDel extends Error {
      code: string;
      constructor(message: string, code: string) {
        super(message);
        this.code = code;
      }
    }
    (Prisma as any).PrismaClientKnownRequestError = FakeKnownDel;

    (prisma.user.delete as unknown as any).mockRejectedValue(
      new FakeKnownDel("Not found", "P2025"),
    );

    await controller.deleteTestUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    (Prisma as any).PrismaClientKnownRequestError = OriginalKnownDel;
  });
});
