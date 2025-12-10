import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import { createServer } from "http";
import { io as Client } from "socket.io-client";
import { initSocket } from "../src/utils/socket";
import { createTask } from "../src/controllers/tasksController";
import prisma from "../src/database/prisma";
import { Request, Response } from "express";

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

  it.skip("should emit task:created event when a task is created", async () => {
    return new Promise<void>(async (resolve, reject) => {
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
          clientSocket.disconnect();
          resolve();
        } catch (e) {
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
        await createTask(req, res);
      }, 100);
    });
  });
});
