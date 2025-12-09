import nodemailer from "nodemailer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendNotificationEmail } from "../src/utils/emailService";

// Mock de nodemailer
vi.mock("nodemailer");

describe("emailService", () => {
  const originalEnv = process.env;
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  beforeEach(() => {
    process.env = { ...originalEnv };
    consoleLogSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  describe("Modo desarrollo sin credenciales", () => {
    it("Returns silently when no EMAIL_USER", async () => {
      delete process.env.EMAIL_USER;
      delete process.env.EMAIL_PASSWORD;

      await sendNotificationEmail(
        "test@test.com",
        "Test User",
        "SYSTEM",
        "Title",
        "Description",
      );

      // Should not throw and not send email
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("Returns silently when no EMAIL_PASSWORD", async () => {
      process.env.EMAIL_USER = "test@test.com";
      delete process.env.EMAIL_PASSWORD;

      await sendNotificationEmail(
        "test@test.com",
        "Test User",
        "SYSTEM",
        "Title",
        "Description",
      );

      // Should not throw and not send email
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("Envío de emails en producción", () => {
    beforeEach(() => {
      process.env.EMAIL_USER = "test@test.com";
      process.env.EMAIL_PASSWORD = "password";
    });

    it("Envía email correctamente en producción", async () => {
      process.env.NODE_ENV = "production";
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "recipient@test.com",
        "Test User",
        "SYSTEM",
        "Test Title",
        "Test Description",
      );

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        service: "gmail",
        auth: {
          user: "test@test.com",
          pass: "password",
        },
      });
      expect(mockSendMail).toHaveBeenCalled();
    });

    it("Envía email correctamente en desarrollo con credenciales", async () => {
      process.env.NODE_ENV = "development";
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "456" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "recipient@test.com",
        "Dev User",
        "SHARED",
        "Dev Title",
        "Dev Description",
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "recipient@test.com",
          subject: "TaskGrid: Dev Title",
        }),
      );
    });

    it("Maneja error al enviar email", async () => {
      const mockSendMail = vi.fn().mockRejectedValue(new Error("Send failed"));
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SYSTEM",
        "Title",
        "Description",
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error al enviar email:",
        expect.any(Error),
      );
    });
  });

  describe("Tipos de notificación", () => {
    beforeEach(() => {
      process.env.EMAIL_USER = "test@test.com";
      process.env.EMAIL_PASSWORD = "password";
    });

    it("Envía notificación tipo SYSTEM", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SYSTEM",
        "General Title",
        "General Description",
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain("#6366f1");
      expect(callArgs.html).toContain("SYSTEM");
    });

    it("Envía notificación tipo SHARED", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SHARED",
        "Mention Title",
        "You were mentioned",
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain("#8b5cf6");
      expect(callArgs.html).toContain("SHARED");
    });

    it("Envía notificación tipo EXPIRED", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User",
        "EXPIRED",
        "Inbox Title",
        "New inbox item",
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain("#ef4444");
      expect(callArgs.html).toContain("EXPIRED");
    });
  });

  describe("Personalización de contenido", () => {
    beforeEach(() => {
      process.env.EMAIL_USER = "test@test.com";
      process.env.EMAIL_PASSWORD = "password";
    });

    it("Incluye nombre de usuario en el email", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "Custom User Name",
        "SYSTEM",
        "Title",
        "Description",
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain("Custom User Name");
    });

    it("Incluye título y descripción en el email", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SYSTEM",
        "Custom Title",
        "Custom Description Text",
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain("Custom Title");
      expect(callArgs.html).toContain("Custom Description Text");
      expect(callArgs.subject).toContain("Custom Title");
    });

    it("Usa CLIENT_URL cuando está definido", async () => {
      process.env.CLIENT_URL = "https://custom.com";
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SYSTEM",
        "Title",
        "Desc",
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain("https://custom.com");
      expect(callArgs.text).toContain("https://custom.com");
    });

    it("Usa URL por defecto cuando CLIENT_URL no está definido", async () => {
      delete process.env.CLIENT_URL;
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SYSTEM",
        "Title",
        "Desc",
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain("http://localhost:5173");
    });
  });

  describe("Edge cases", () => {
    beforeEach(() => {
      process.env.EMAIL_USER = "test@test.com";
      process.env.EMAIL_PASSWORD = "password";
    });

    it("Maneja strings vacíos", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail("test@test.com", "", "SYSTEM", "", "");

      expect(mockSendMail).toHaveBeenCalled();
    });

    it("Maneja contenido muy largo", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      const longText = "A".repeat(1000);
      await sendNotificationEmail(
        "test@test.com",
        longText,
        "SYSTEM",
        longText,
        longText,
      );

      expect(mockSendMail).toHaveBeenCalled();
    });

    it("Maneja caracteres especiales HTML", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User <script>",
        "SYSTEM",
        "Title & < >",
        'Desc "quotes"',
      );

      expect(mockSendMail).toHaveBeenCalled();
    });

    it("Maneja email recipient con formato especial", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "user+tag@example.com",
        "User",
        "SYSTEM",
        "Title",
        "Desc",
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe("user+tag@example.com");
    });

    it("Verifica estructura completa del email", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SYSTEM",
        "Title",
        "Description",
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs).toHaveProperty("from");
      expect(callArgs).toHaveProperty("to");
      expect(callArgs).toHaveProperty("subject");
      expect(callArgs).toHaveProperty("html");
      expect(callArgs).toHaveProperty("text");
      expect(callArgs.from).toContain("TaskGrid");
      expect(callArgs.subject).toContain("TaskGrid:");
    });

    it("No lanza error cuando falla el envío", async () => {
      const mockSendMail = vi
        .fn()
        .mockRejectedValue(new Error("Network error"));
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await expect(
        sendNotificationEmail(
          "test@test.com",
          "User",
          "SYSTEM",
          "Title",
          "Desc",
        ),
      ).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("Successfully sends email with messageId", async () => {
      const mockSendMail = vi
        .fn()
        .mockResolvedValue({ messageId: "unique-message-id-123" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SYSTEM",
        "Title",
        "Desc",
      );

      expect(mockSendMail).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    beforeEach(() => {
      process.env.EMAIL_USER = "test@test.com";
      process.env.EMAIL_PASSWORD = "password123";
      process.env.NODE_ENV = "production";
    });

    it("should handle empty recipient email", async () => {
      const mockSendMail = vi
        .fn()
        .mockResolvedValue({ messageId: "empty-email-test" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail("", "User", "SYSTEM", "Title", "Desc");

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "",
        }),
      );
    });

    it("should handle empty username", async () => {
      const mockSendMail = vi
        .fn()
        .mockResolvedValue({ messageId: "empty-user-test" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "",
        "SYSTEM",
        "Title",
        "Desc",
      );

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.html).toContain("Hola, ");
    });

    it("should handle empty title", async () => {
      const mockSendMail = vi
        .fn()
        .mockResolvedValue({ messageId: "empty-title-test" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SYSTEM",
        "",
        "Desc",
      );

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.subject).toBe("TaskGrid: ");
    });

    it("should handle empty description", async () => {
      const mockSendMail = vi
        .fn()
        .mockResolvedValue({ messageId: "empty-desc-test" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SYSTEM",
        "Title",
        "",
      );

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.html).toContain("Title");
    });

    it("should handle all fields empty", async () => {
      const mockSendMail = vi
        .fn()
        .mockResolvedValue({ messageId: "all-empty-test" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      await sendNotificationEmail("", "", "SYSTEM", "", "");

      expect(mockSendMail).toHaveBeenCalled();
    });

    it("should handle very long content", async () => {
      const mockSendMail = vi
        .fn()
        .mockResolvedValue({ messageId: "long-content-test" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      const longContent = "a".repeat(10000);
      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SYSTEM",
        longContent,
        longContent,
      );

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.html).toContain(longContent);
    });

    it("should handle special characters in all fields", async () => {
      const mockSendMail = vi
        .fn()
        .mockResolvedValue({ messageId: "special-chars-test" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      const specialText = "<script>alert('XSS')</script>";
      await sendNotificationEmail(
        "test@test.com",
        specialText,
        "SYSTEM",
        specialText,
        specialText,
      );

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.html).toBeDefined();
    });

    it("should handle unicode characters", async () => {
      const mockSendMail = vi
        .fn()
        .mockResolvedValue({ messageId: "unicode-test" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      const unicodeText = "こんにちは 🌍 émojis";
      await sendNotificationEmail(
        "test@test.com",
        unicodeText,
        "SYSTEM",
        unicodeText,
        unicodeText,
      );

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.html).toContain(unicodeText);
    });

    it("should handle newlines in description", async () => {
      const mockSendMail = vi
        .fn()
        .mockResolvedValue({ messageId: "newlines-test" });
      const mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(
        mockTransporter as never,
      );

      const multilineDesc = "Line 1\nLine 2\nLine 3";
      await sendNotificationEmail(
        "test@test.com",
        "User",
        "SYSTEM",
        "Title",
        multilineDesc,
      );

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.html).toContain(multilineDesc);
    });
  });
});
