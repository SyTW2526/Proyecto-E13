import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import {
  getProfile,
  updateName,
  updateEmailNotificationSetting,
  updatePushNotificationSetting,
  deleteAccount,
} from "../src/controllers/usersController";
import prisma from "../src/database/prisma";
import { Prisma } from "@prisma/client";

vi.mock("../src/database/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

describe("UsersController", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      user: undefined,
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return user profile successfully", async () => {
      mockRequest.user = { id: "user-123" };

      const mockUser = {
        id: "user-123",
        email: "john@example.com",
        name: "John Doe",
        image: null,
        emailNotifications: true,
        pushNotifications: false,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      await getProfile(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          emailNotifications: true,
          pushNotifications: true,
          emailVerifiedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 401 if user not authenticated", async () => {
      mockRequest.user = undefined;

      await getProfile(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unauthorized",
      });
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      mockRequest.user = { id: "nonexistent-user" };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await getProfile(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });

    it("should return 500 on database error", async () => {
      mockRequest.user = { id: "user-123" };
      vi.mocked(prisma.user.findUnique).mockRejectedValue(
        new Error("DB Error"),
      );

      await getProfile(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("updateName", () => {
    it("should update user name successfully", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = { name: "Jane Doe" };

      const updatedUser = {
        id: "user-123",
        name: "Jane Doe",
      };

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      await updateName(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { name: "Jane Doe" },
        select: {
          id: true,
          name: true,
        },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should return 401 if user not authenticated", async () => {
      mockRequest.user = undefined;
      mockRequest.body = { name: "Jane Doe" };

      await updateName(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unauthorized",
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it("should return 500 on database error", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = { name: "Jane Doe" };
      vi.mocked(prisma.user.update).mockRejectedValue(new Error("DB Error"));

      await updateName(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("updateEmailNotificationSetting", () => {
    it("should update email notification setting to true", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = { emailNotifications: true };

      const updatedUser = {
        id: "user-123",
        emailNotifications: true,
      };

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      await updateEmailNotificationSetting(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { emailNotifications: true },
        select: {
          id: true,
          emailNotifications: true,
        },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should update email notification setting to false", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = { emailNotifications: false };

      const updatedUser = {
        id: "user-123",
        emailNotifications: false,
      };

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      await updateEmailNotificationSetting(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should return 401 if user not authenticated", async () => {
      mockRequest.user = undefined;
      mockRequest.body = { emailNotifications: true };

      await updateEmailNotificationSetting(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unauthorized",
      });
    });

    it("should return 400 if emailNotifications is not boolean", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = { emailNotifications: "true" };

      await updateEmailNotificationSetting(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "emailNotifications must be a boolean",
      });
    });

    it("should return 500 on database error", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = { emailNotifications: true };
      vi.mocked(prisma.user.update).mockRejectedValue(new Error("DB Error"));

      await updateEmailNotificationSetting(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("updatePushNotificationSetting", () => {
    it("should update push notification setting to true", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = { pushNotifications: true };

      const updatedUser = {
        id: "user-123",
        pushNotifications: true,
      };

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      await updatePushNotificationSetting(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { pushNotifications: true },
        select: {
          id: true,
          pushNotifications: true,
        },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should update push notification setting to false", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = { pushNotifications: false };

      const updatedUser = {
        id: "user-123",
        pushNotifications: false,
      };

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      await updatePushNotificationSetting(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should return 401 if user not authenticated", async () => {
      mockRequest.user = undefined;
      mockRequest.body = { pushNotifications: true };

      await updatePushNotificationSetting(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unauthorized",
      });
    });

    it("should return 400 if pushNotifications is not boolean", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = { pushNotifications: "true" };

      await updatePushNotificationSetting(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "pushNotifications must be a boolean",
      });
    });

    it("should return 500 on database error", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = { pushNotifications: true };
      vi.mocked(prisma.user.update).mockRejectedValue(new Error("DB Error"));

      await updatePushNotificationSetting(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("deleteAccount", () => {
    it("should delete account successfully", async () => {
      mockRequest.user = { id: "user-123" };

      vi.mocked(prisma.user.delete).mockResolvedValue({} as any);

      await deleteAccount(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: "user-123" },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Account deleted successfully",
      });
    });

    it("should return 401 if user not authenticated", async () => {
      mockRequest.user = undefined;

      await deleteAccount(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unauthorized",
      });
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it("should return 404 if user not found (P2025)", async () => {
      mockRequest.user = { id: "nonexistent-user" };

      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        {
          code: "P2025",
          clientVersion: "5.0.0",
        },
      );

      vi.mocked(prisma.user.delete).mockRejectedValue(prismaError);

      await deleteAccount(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });

    it("should return 500 on database error", async () => {
      mockRequest.user = { id: "user-123" };
      vi.mocked(prisma.user.delete).mockRejectedValue(new Error("DB Error"));

      await deleteAccount(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});
