import { describe, expect, it, vi } from "vitest";

// Mock Prisma
vi.mock("../src/database/prisma", () => ({
  default: {
    list: {
      findUnique: vi.fn(),
    },
    task: {
      create: vi.fn(),
    },
  },
}));

describe("Socket getIO error handling", () => {
  it("should throw error when getIO is called before initSocket", async () => {
    // Importar dinámicamente para tener un módulo fresco
    const socketModule = await import("../src/utils/socket");

    expect(() => {
      socketModule.getIO();
    }).toThrow("Socket.io not initialized!");
  });
});
