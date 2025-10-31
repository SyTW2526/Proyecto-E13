import { describe, it, expect } from "vitest";
import prisma from "../src/database/database";

describe("prisma client smoke", () => {
  it("exporta un PrismaClient con métodos esperados", () => {
    expect(prisma).toBeDefined();
    // métodos del cliente prisma
    expect(typeof (prisma as any).$connect).toBe("function");
    expect(typeof (prisma as any).$disconnect).toBe("function");
    // la propiedad `user` debe existir en el cliente generado
    expect((prisma as any).user).toBeDefined();
  });
});
