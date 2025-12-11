import { PrismaClient } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock PrismaClient
vi.mock("@prisma/client", () => {
  return {
    PrismaClient: class MockPrismaClient {
      $connect = vi.fn();
      $disconnect = vi.fn();
      user = {};
      task = {};
      list = {};
      share = {};
      notification = {};

      constructor(options?: any) {
        // Store options for testing
        (this as any).options = options;
      }
    },
  };
});

describe("Prisma Client Configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear global prisma to force recreation
    const global = globalThis as { prisma?: PrismaClient };
    delete global.prisma;
    // Clear the module cache to get a fresh instance
    vi.resetModules();
  });

  it("should create a PrismaClient instance", async () => {
    const prisma = await import("../src/database/prisma");
    expect(prisma.default).toBeDefined();
  });

  it("should create PrismaClient instance", async () => {
    const prisma = await import("../src/database/prisma");

    expect(prisma.default).toBeInstanceOf(PrismaClient);
    expect(prisma.default).toHaveProperty("$connect");
    expect(prisma.default).toHaveProperty("$disconnect");
  });

  it("should reuse the same PrismaClient instance", async () => {
    const prisma1 = await import("../src/database/prisma");
    const prisma2 = await import("../src/database/prisma");

    expect(prisma1.default).toBe(prisma2.default);
  });

  it("should attach PrismaClient to global object", async () => {
    const prisma = await import("../src/database/prisma");
    const global = globalThis as { prisma?: PrismaClient };

    expect(global.prisma).toBeDefined();
    expect(prisma.default).toBe(global.prisma);
  });

  it("should have PrismaClient with required models", async () => {
    const prisma = await import("../src/database/prisma");

    expect(prisma.default).toHaveProperty("user");
    expect(prisma.default).toHaveProperty("task");
    expect(prisma.default).toHaveProperty("list");
    expect(prisma.default).toHaveProperty("share");
    expect(prisma.default).toHaveProperty("notification");
  });
});
