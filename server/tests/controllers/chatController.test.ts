import express, { Application } from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { chatController } from "../../src/controllers/chatController";
import { streamText } from "ai";

vi.mock("ai", () => ({
  streamText: vi.fn(),
}));

vi.mock("@ai-sdk/google", () => ({
  google: vi.fn(() => "mocked-model"),
}));

describe("Chat Routes", () => {
  let app: Application;

  beforeEach(() => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use("/api/chat", chatController);
  });

  it("should return 400 if messages is not provided", async () => {
    const response = await request(app).post("/api/chat").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Messages array is required",
    });
  });

  it("should return 400 if messages is not an array", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({ messages: "not an array" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Messages array is required",
    });
  });

  it("should setup correct headers and stream response", async () => {
    const mockTextStream = (async function* () {
      yield "Hello";
      yield " ";
      yield "World";
    })();

    vi.mocked(streamText).mockReturnValue({
      textStream: mockTextStream,
    } as any);

    const response = await request(app)
      .post("/api/chat")
      .send({
        messages: [{ role: "user", content: "Hello" }],
      });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("text/event-stream");
    expect(response.headers["cache-control"]).toBe("no-cache");
    expect(response.headers["connection"]).toBe("keep-alive");
  });

  it("should call streamText with correct parameters", async () => {
    const mockTextStream = (async function* () {
      yield "test";
    })();

    vi.mocked(streamText).mockReturnValue({
      textStream: mockTextStream,
    } as any);

    const messages = [{ role: "user", content: "Test message" }];

    await request(app).post("/api/chat").send({ messages });

    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        messages,
        system: expect.stringContaining("TaskGrid"),
      }),
    );
  });

  it("should use GEMINI_MODEL from environment", async () => {
    const originalEnv = process.env.GEMINI_MODEL;
    process.env.GEMINI_MODEL = "custom-model";

    const mockTextStream = (async function* () {
      yield "test";
    })();

    vi.mocked(streamText).mockReturnValue({
      textStream: mockTextStream,
    } as any);

    await request(app)
      .post("/api/chat")
      .send({
        messages: [{ role: "user", content: "Test" }],
      });

    expect(streamText).toHaveBeenCalled();

    if (originalEnv) {
      process.env.GEMINI_MODEL = originalEnv;
    } else {
      delete process.env.GEMINI_MODEL;
    }
  });

  it("should stream multiple chunks correctly", async () => {
    const mockTextStream = (async function* () {
      yield "chunk1";
      yield "chunk2";
      yield "chunk3";
    })();

    vi.mocked(streamText).mockReturnValue({
      textStream: mockTextStream,
    } as any);

    const response = await request(app)
      .post("/api/chat")
      .send({
        messages: [{ role: "user", content: "Hello" }],
      });

    expect(response.status).toBe(200);
    expect(response.text).toContain("chunk1");
    expect(response.text).toContain("chunk2");
    expect(response.text).toContain("chunk3");
    expect(response.text).toContain("[DONE]");
  });

  it("should handle non-Error exceptions", async () => {

    vi.mocked(streamText).mockImplementation(() => {
      throw "String error";
    });

    const response = await request(app)
      .post("/api/chat")
      .send({
        messages: [{ role: "user", content: "Hello" }],
      });

    expect(response.status).toBe(500);
  });
});
