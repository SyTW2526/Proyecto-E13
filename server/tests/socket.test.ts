import { Request, Response } from "express";
import { createServer } from "http";
import { io as Client } from "socket.io-client";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { createTask } from "../src/controllers/tasksController";
import prisma from "../src/database/prisma";
import { getIO, initSocket } from "../src/utils/socket";

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

describe("Socket Integration", () => {
  let httpServer: any;
  let port: number;
  let clientSocket: any;

  beforeAll(() => {
    httpServer = createServer();
    initSocket(httpServer);
    return new Promise<void>((resolve) => {
      httpServer.listen(() => {
        port = (httpServer.address() as any).port;
        resolve();
      });
    });
  });

  afterAll(() => {
    return new Promise<void>((resolve) => {
      httpServer.close(() => resolve());
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should emit task:created event when a task is created", async () => {
    return new Promise<void>(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        clientSocket?.disconnect();
        reject(new Error("Test timeout"));
      }, 5000);

      clientSocket = Client(`http://localhost:${port}`);

      const listId = "test-list-id";
      const userId = "test-user-id";

      clientSocket.on("connect", () => {
        clientSocket.emit("join_list", listId);
      });

      clientSocket.on("task:created", (task: any) => {
        try {
          expect(task.name).toBe("New Task");
          expect(task.listId).toBe(listId);
          clearTimeout(timeout);
          clientSocket.disconnect();
          resolve();
        } catch (e) {
          clearTimeout(timeout);
          clientSocket.disconnect();
          reject(e);
        }
      });

      // Mock Request/Response
      const req = {
        user: { id: userId },
        body: {
          name: "New Task",
          listId,
          status: "PENDING",
        },
      } as unknown as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock Prisma responses
      vi.mocked(prisma.list.findUnique).mockResolvedValue({
        id: listId,
        ownerId: userId,
        shares: [],
      } as any);

      vi.mocked(prisma.task.create).mockResolvedValue({
        id: "new-task-id",
        name: "New Task",
        listId,
        status: "PENDING",
        shares: [],
        list: { id: listId },
      } as any);

      // Wait a bit for socket to connect and join room
      setTimeout(async () => {
        try {
          await createTask(req, res);
        } catch (e) {
          clearTimeout(timeout);
          clientSocket.disconnect();
          reject(e);
        }
      }, 200);
    });
  });

  it("should allow users to join user rooms", async () => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        clientSocket?.disconnect();
        reject(new Error("Test timeout"));
      }, 3000);

      clientSocket = Client(`http://localhost:${port}`);
      const userId = "test-user-123";

      clientSocket.on("connect", () => {
        clientSocket.emit("join_user", userId);

        // Esperar un poco para asegurar que se procese
        setTimeout(() => {
          clearTimeout(timeout);
          clientSocket.disconnect();
          resolve();
        }, 100);
      });

      clientSocket.on("error", (error: any) => {
        clearTimeout(timeout);
        clientSocket.disconnect();
        reject(error);
      });
    });
  });

  it("should allow users to leave list rooms", async () => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        clientSocket?.disconnect();
        reject(new Error("Test timeout"));
      }, 3000);

      clientSocket = Client(`http://localhost:${port}`);
      const listId = "test-list-456";

      clientSocket.on("connect", () => {
        // Primero unirse a la sala
        clientSocket.emit("join_list", listId);

        // Esperar y luego salir de la sala
        setTimeout(() => {
          clientSocket.emit("leave_list", listId);

          // Esperar un poco más antes de resolver
          setTimeout(() => {
            clearTimeout(timeout);
            clientSocket.disconnect();
            resolve();
          }, 100);
        }, 100);
      });

      clientSocket.on("error", (error: any) => {
        clearTimeout(timeout);
        clientSocket.disconnect();
        reject(error);
      });
    });
  });

  it("should handle disconnect event", async () => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Test timeout"));
      }, 3000);

      clientSocket = Client(`http://localhost:${port}`);

      clientSocket.on("connect", () => {
        clientSocket.disconnect();
      });

      clientSocket.on("disconnect", () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  });
});

describe("Socket getIO", () => {
  it("should return initialized socket instance", () => {
    const io = getIO();
    expect(io).toBeDefined();
    expect(io.sockets).toBeDefined();
  });
});
