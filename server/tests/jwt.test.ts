import jwt from "jsonwebtoken";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { JwtPayload } from "../src/types/jwt";
import { generateToken, verifyToken } from "../src/utils/jwt";

vi.mock("jsonwebtoken");

describe("JWT Utils", () => {
  const mockPayload: JwtPayload = { userId: "123" };
  const mockToken = "mock.jwt.token";

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      (vi.mocked(jwt.sign) as unknown as Mock).mockReturnValue(mockToken);

      const result = generateToken(mockPayload);

      expect(result).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        expect.any(String),
        expect.objectContaining({
          expiresIn: "7d",
          algorithm: "HS256",
          issuer: "taskgrid-api",
        }),
      );
    });

    it("should call jwt.sign with correct parameters", () => {
      (vi.mocked(jwt.sign) as unknown as Mock).mockReturnValue(mockToken);

      generateToken(mockPayload);

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      const calls = vi.mocked(jwt.sign).mock.calls[0];
      expect(calls[0]).toEqual(mockPayload);
      expect(calls[2]).toHaveProperty("algorithm", "HS256");
      expect(calls[2]).toHaveProperty("issuer", "taskgrid-api");
      expect(calls[2]).toHaveProperty("expiresIn", "7d");
    });
  });

  describe("verifyToken", () => {
    it("should verify and return payload from valid token", () => {
      (vi.mocked(jwt.verify) as unknown as Mock).mockReturnValue(mockPayload);

      const result = verifyToken(mockToken);

      expect(result).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        expect.any(String),
        expect.objectContaining({
          algorithms: ["HS256"],
          issuer: "taskgrid-api",
        }),
      );
    });

    it("should throw 'Token has expired' for expired tokens", () => {
      const expiredError = new jwt.TokenExpiredError("jwt expired", new Date());
      (vi.mocked(jwt.verify) as unknown as Mock).mockImplementation(() => {
        throw expiredError;
      });

      expect(() => verifyToken(mockToken)).toThrow("Token has expired");
    });

    it("should throw 'Invalid token' for malformed tokens", () => {
      const jsonError = new jwt.JsonWebTokenError("invalid token");
      (vi.mocked(jwt.verify) as unknown as Mock).mockImplementation(() => {
        throw jsonError;
      });

      expect(() => verifyToken(mockToken)).toThrow("Invalid token");
    });

    it("should throw 'Invalid token' for wrong signature", () => {
      const sigError = new jwt.JsonWebTokenError("invalid signature");
      (vi.mocked(jwt.verify) as unknown as Mock).mockImplementation(() => {
        throw sigError;
      });

      expect(() => verifyToken(mockToken)).toThrow("Invalid token");
    });

    it("should rethrow other errors", () => {
      const otherError = new Error("Database error");
      (vi.mocked(jwt.verify) as unknown as Mock).mockImplementation(() => {
        throw otherError;
      });

      expect(() => verifyToken(mockToken)).toThrow("Database error");
    });

    it("should handle empty token string", () => {
      (vi.mocked(jwt.verify) as unknown as Mock).mockReturnValue(mockPayload);

      const result = verifyToken("");

      expect(jwt.verify).toHaveBeenCalledWith("", expect.any(String), {
        algorithms: ["HS256"],
        issuer: "taskgrid-api",
      });
      expect(result).toEqual(mockPayload);
    });

    it("should handle token with special characters", () => {
      (vi.mocked(jwt.verify) as unknown as Mock).mockReturnValue(mockPayload);

      const specialToken = "token.with.special!@#$%^&*()";
      verifyToken(specialToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        specialToken,
        expect.any(String),
        {
          algorithms: ["HS256"],
          issuer: "taskgrid-api",
        },
      );
    });

    it("should handle very long token", () => {
      (vi.mocked(jwt.verify) as unknown as Mock).mockReturnValue(mockPayload);

      const longToken = "a".repeat(1000);
      verifyToken(longToken);

      expect(jwt.verify).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should generate token with empty userId", () => {
      (vi.mocked(jwt.sign) as unknown as Mock).mockReturnValue(mockToken);

      const emptyPayload: JwtPayload = { userId: "" };
      const result = generateToken(emptyPayload);

      expect(result).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        emptyPayload,
        expect.any(String),
        expect.any(Object),
      );
    });

    it("should generate token with very long userId", () => {
      (vi.mocked(jwt.sign) as unknown as Mock).mockReturnValue(mockToken);

      const longPayload: JwtPayload = { userId: "a".repeat(1000) };
      generateToken(longPayload);

      expect(jwt.sign).toHaveBeenCalledWith(
        longPayload,
        expect.any(String),
        expect.any(Object),
      );
    });

    it("should generate token with special characters in userId", () => {
      (vi.mocked(jwt.sign) as unknown as Mock).mockReturnValue(mockToken);

      const specialPayload: JwtPayload = { userId: "user@email.com!#$%" };
      generateToken(specialPayload);

      expect(jwt.sign).toHaveBeenCalledWith(
        specialPayload,
        expect.any(String),
        expect.any(Object),
      );
    });

    it("should verify token returns exact payload structure", () => {
      const complexPayload: JwtPayload = { userId: "123" };
      (vi.mocked(jwt.verify) as unknown as Mock).mockReturnValue(
        complexPayload,
      );

      const result = verifyToken(mockToken);

      expect(result).toStrictEqual(complexPayload);
      expect(result).toHaveProperty("userId");
    });

    it("should handle jwt.verify with additional properties in return", () => {
      const extendedPayload = {
        userId: "123",
        iat: 1234567890,
        exp: 1234567890,
      };
      (vi.mocked(jwt.verify) as unknown as Mock).mockReturnValue(
        extendedPayload,
      );

      const result = verifyToken(mockToken);

      expect(result).toBeDefined();
      expect(result.userId).toBe("123");
    });

    it("should call verify with exact algorithm in array", () => {
      (vi.mocked(jwt.verify) as unknown as Mock).mockReturnValue(mockPayload);

      verifyToken(mockToken);

      const verifyCall = vi.mocked(jwt.verify).mock.calls[0];
      expect(verifyCall[2]).toHaveProperty("algorithms");
      expect(verifyCall[2]?.algorithms).toEqual(["HS256"]);
    });

    it("should handle TokenExpiredError with custom date", () => {
      const customDate = new Date("2025-01-01");
      const expiredError = new jwt.TokenExpiredError(
        "custom message",
        customDate,
      );
      (vi.mocked(jwt.verify) as unknown as Mock).mockImplementation(() => {
        throw expiredError;
      });

      expect(() => verifyToken(mockToken)).toThrow("Token has expired");
      expect(() => verifyToken(mockToken)).toThrow(Error);
    });

    it("should handle JsonWebTokenError with different messages", () => {
      const messages = [
        "jwt malformed",
        "jwt signature is required",
        "invalid algorithm",
      ];

      messages.forEach((message) => {
        const error = new jwt.JsonWebTokenError(message);
        (vi.mocked(jwt.verify) as unknown as Mock).mockImplementation(() => {
          throw error;
        });

        expect(() => verifyToken(mockToken)).toThrow("Invalid token");
      });
    });

    it("should preserve original error type when rethrowing", () => {
      const customError = new TypeError("Custom type error");
      (vi.mocked(jwt.verify) as unknown as Mock).mockImplementation(() => {
        throw customError;
      });

      expect(() => verifyToken(mockToken)).toThrow(TypeError);
      expect(() => verifyToken(mockToken)).toThrow("Custom type error");
    });
  });

  describe("Production Environment Validation (Line 10)", () => {
    it("should work correctly when JWT_SECRET is set in test environment", () => {
      process.env.JWT_SECRET = "custom-test-secret";
      process.env.NODE_ENV = "test";

      (vi.mocked(jwt.sign) as unknown as Mock).mockReturnValue(mockToken);

      const result = generateToken(mockPayload);

      expect(result).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalled();
    });

    it("should work correctly when JWT_SECRET is set to non-dev value", () => {
      process.env.JWT_SECRET = "production-secret-key";
      process.env.NODE_ENV = "production";

      (vi.mocked(jwt.sign) as unknown as Mock).mockReturnValue(mockToken);

      const result = generateToken(mockPayload);

      expect(result).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalled();
    });

    it("should handle dev-secret in development environment", () => {
      process.env.JWT_SECRET = "dev-secret";
      process.env.NODE_ENV = "development";

      (vi.mocked(jwt.sign) as unknown as Mock).mockReturnValue(mockToken);

      const result = generateToken(mockPayload);

      expect(result).toBe(mockToken);
    });

    it("should handle dev-secret in test environment", () => {
      process.env.JWT_SECRET = "dev-secret";
      process.env.NODE_ENV = "test";

      (vi.mocked(jwt.sign) as unknown as Mock).mockReturnValue(mockToken);

      const result = generateToken(mockPayload);

      expect(result).toBe(mockToken);
    });
  });
});
