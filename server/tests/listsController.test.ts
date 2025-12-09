import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import { shareList } from "../src/controllers/listsController";
import prisma from "../src/database/prisma";
import { createNotification } from "../src/controllers/notificationsController";

vi.mock("../src/database/prisma", () => ({
  default: {
    list: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    listShare: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("../src/controllers/notificationsController", () => ({
  createNotification: vi.fn(),
}));

vi.mock("../src/utils/socket", () => ({
  getIO: vi.fn().mockReturnValue({
    to: vi.fn().mockReturnThis(),
    emit: vi.fn(),
  }),
}));

describe("ListsController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
      user: { id: "owner-id" } as any,
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe("shareList", () => {
    it("should share list and send notification", async () => {
      mockRequest.params = { id: "list-id" };
      mockRequest.body = { email: "friend@example.com" };

      const mockList = {
        id: "list-id",
        name: "My List",
        ownerId: "owner-id",
        shares: [],
      };

      const mockUserToShare = {
        id: "friend-id",
        email: "friend@example.com",
      };

      const mockCurrentUser = {
        id: "owner-id",
        name: "Owner Name",
      };

      vi.mocked(prisma.list.findUnique).mockResolvedValue(mockList as any);
      vi.mocked(prisma.user.findUnique)
        .mockResolvedValueOnce(mockUserToShare as any) // First call for user to share
        .mockResolvedValueOnce(mockCurrentUser as any); // Second call for current user name

      vi.mocked(prisma.listShare.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.list.update).mockResolvedValue({
        ...mockList,
        name: "My List",
      } as any);

      await shareList(mockRequest as Request, mockResponse as Response);

      expect(prisma.list.update).toHaveBeenCalled();
      expect(createNotification).toHaveBeenCalledWith(
        "friend-id",
        "GENERAL",
        "Nueva lista compartida",
        'Owner Name te ha compartido la lista "My List"',
        "Owner Name",
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
