import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import {
  updateProfile,
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

  describe("updateProfile", () => {
    it("should update user profile successfully", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = {
        name: "John Doe",
        emailNotifications: true,
        pushNotifications: false,
      };

      const updatedUser = {
        id: "user-123",
        email: "john@example.com",
        name: "John Doe",
        image: null,
        emailNotifications: true,
        pushNotifications: false,
        googleSub: null,
      };

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      await updateProfile(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: {
          name: "John Doe",
          emailNotifications: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          emailNotifications: true,
          pushNotifications: true,
          googleSub: true,
        },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ...updatedUser,
        isGoogleAuthUser: false,
      });
    });

    it("should return 401 if user not authenticated", async () => {
      mockRequest.user = undefined;
      mockRequest.body = {
        name: "John Doe",
        emailNotifications: true,
        pushNotifications: false,
      };

      await updateProfile(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unauthorized",
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it("should return 500 on database error", async () => {
      mockRequest.user = { id: "user-123" };
      mockRequest.body = {
        name: "John Doe",
        emailNotifications: true,
        pushNotifications: false,
      };
      vi.mocked(prisma.user.update).mockRejectedValue(new Error("DB Error"));

      await updateProfile(mockRequest as Request, mockResponse as Response);

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
