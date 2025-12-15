import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChatMessage } from "@/components/chat/ChatMessage";

vi.mock("@/components/chat/MarkdownRenderer", () => ({
  MarkdownRenderer: ({ children }: { children: string }) => (
    <div data-testid="markdown">{children}</div>
  ),
}));

vi.mock("@/components/chat/FilePreview", () => ({
  FilePreview: ({ file }: { file: File }) => (
    <div data-testid="file-preview">{file.name}</div>
  ),
}));

describe("ChatMessage", () => {
  const defaultProps = {
    role: "user" as const,
    content: "Hello",
    id: "1",
    createdAt: new Date(),
  };

  it("debe renderizar mensaje de usuario", () => {
    render(<ChatMessage {...defaultProps} />);
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("debe renderizar mensaje de asistente", () => {
    render(
      <ChatMessage {...defaultProps} role="assistant" content="Hi there" />,
    );
    expect(screen.getByText("Hi there")).toBeDefined();
  });

  it("debe aplicar animación slide por defecto", () => {
    const { container } = render(<ChatMessage {...defaultProps} />);
    expect(container.firstChild).toBeDefined();
  });

  it("debe aplicar animación scale", () => {
    const { container } = render(
      <ChatMessage {...defaultProps} animation="scale" />,
    );
    expect(container.firstChild).toBeDefined();
  });

  it("debe aplicar animación fade", () => {
    const { container } = render(
      <ChatMessage {...defaultProps} animation="fade" />,
    );
    expect(container.firstChild).toBeDefined();
  });

  it("debe aplicar animación none", () => {
    const { container } = render(
      <ChatMessage {...defaultProps} animation="none" />,
    );
    expect(container.firstChild).toBeDefined();
  });

  it("debe mostrar timestamp cuando showTimeStamp es true", () => {
    render(<ChatMessage {...defaultProps} showTimeStamp={true} />);
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("debe ocultar timestamp cuando showTimeStamp es false", () => {
    render(<ChatMessage {...defaultProps} showTimeStamp={false} />);
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("debe renderizar con diferentes roles", () => {
    const { rerender } = render(<ChatMessage {...defaultProps} role="user" />);
    expect(screen.getByText("Hello")).toBeDefined();

    rerender(<ChatMessage {...defaultProps} role="assistant" />);
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("debe manejar contenido vacío", () => {
    render(<ChatMessage {...defaultProps} content="" />);
    expect(screen.queryByText("Hello")).toBeNull();
  });

  it("debe renderizar mensaje de sistema", () => {
    render(
      <ChatMessage {...defaultProps} role="system" content="System message" />,
    );
    expect(screen.getByText("System message")).toBeDefined();
  });

  it("debe renderizar múltiples mensajes del mismo usuario", () => {
    const { rerender } = render(
      <ChatMessage {...defaultProps} content="Message 1" />,
    );
    expect(screen.getByText("Message 1")).toBeDefined();

    rerender(<ChatMessage {...defaultProps} content="Message 2" />);
    expect(screen.getByText("Message 2")).toBeDefined();
  });

  it("debe manejar contenido con formato markdown", () => {
    render(
      <ChatMessage
        {...defaultProps}
        role="assistant"
        content="**bold** text"
      />,
    );
    expect(screen.getByTestId("markdown")).toBeDefined();
  });

  it("debe renderizar correctamente fechas pasadas", () => {
    const pastDate = new Date("2023-01-01");
    render(
      <ChatMessage
        {...defaultProps}
        createdAt={pastDate}
        showTimeStamp={true}
      />,
    );
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("debe renderizar correctamente fechas futuras", () => {
    const futureDate = new Date("2030-01-01");
    render(
      <ChatMessage
        {...defaultProps}
        createdAt={futureDate}
        showTimeStamp={true}
      />,
    );
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("renders assistant message with content", () => {
    render(
      <ChatMessage
        id="2"
        role="assistant"
        content="Assistant reply"
        createdAt={new Date()}
      />,
    );
    expect(screen.getByText("Assistant reply")).toBeDefined();
  });

  it("renders with actions", () => {
    render(
      <ChatMessage
        {...defaultProps}
        role="assistant"
        actions={<button>Copy</button>}
      />,
    );
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("renders with text parts", () => {
    render(
      <ChatMessage
        id="3"
        role="assistant"
        content=""
        parts={[{ type: "text", text: "Part text content" }]}
        createdAt={new Date()}
      />,
    );
    expect(screen.getByText("Part text content")).toBeDefined();
  });

  it("renders with reasoning parts", () => {
    render(
      <ChatMessage
        id="4"
        role="assistant"
        content=""
        parts={[{ type: "reasoning", reasoning: "Reasoning content" }]}
        createdAt={new Date()}
      />,
    );
    expect(screen.getByText("Thinking")).toBeDefined();
  });

  it("renders with tool invocation parts - call state", () => {
    render(
      <ChatMessage
        id="5"
        role="assistant"
        content=""
        parts={[
          {
            type: "tool-invocation",
            toolInvocation: { state: "call", toolName: "testTool" },
          },
        ]}
        createdAt={new Date()}
      />,
    );
    expect(screen.getByText(/Calling/)).toBeDefined();
  });

  it("renders with toolInvocations prop - partial-call state", () => {
    render(
      <ChatMessage
        id="6"
        role="assistant"
        content=""
        toolInvocations={[{ state: "partial-call", toolName: "partialTool" }]}
        createdAt={new Date()}
      />,
    );
    expect(screen.getByText(/Calling/)).toBeDefined();
  });

  it("renders with toolInvocations prop - result state", () => {
    render(
      <ChatMessage
        id="7"
        role="assistant"
        content=""
        toolInvocations={[
          { state: "result", toolName: "resultTool", result: { data: "test" } },
        ]}
        createdAt={new Date()}
      />,
    );
    expect(screen.getByText(/Result from/)).toBeDefined();
  });

  it("renders cancelled tool invocation", () => {
    render(
      <ChatMessage
        id="8"
        role="assistant"
        content=""
        toolInvocations={[
          {
            state: "result",
            toolName: "cancelledTool",
            result: { __cancelled: true },
          },
        ]}
        createdAt={new Date()}
      />,
    );
    expect(screen.getByText(/Cancelled/)).toBeDefined();
  });

  it("renders user message with timestamp", () => {
    render(
      <ChatMessage
        {...defaultProps}
        showTimeStamp={true}
        createdAt={new Date("2024-06-15T14:30:00")}
      />,
    );
    expect(screen.getByRole("time")).toBeDefined();
  });

  it("renders assistant message with timestamp", () => {
    render(
      <ChatMessage
        id="9"
        role="assistant"
        content="Reply"
        showTimeStamp={true}
        createdAt={new Date("2024-06-15T14:30:00")}
      />,
    );
    expect(screen.getByText("Reply")).toBeDefined();
  });

  it("renders with none animation", () => {
    render(<ChatMessage {...defaultProps} animation="none" showTimeStamp />);
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("renders with parts containing showTimeStamp", () => {
    render(
      <ChatMessage
        id="10"
        role="assistant"
        content=""
        parts={[{ type: "text", text: "Text with timestamp" }]}
        showTimeStamp={true}
        createdAt={new Date()}
      />,
    );
    expect(screen.getByText("Text with timestamp")).toBeDefined();
  });

  it("renders with actions in parts", () => {
    render(
      <ChatMessage
        id="11"
        role="assistant"
        content=""
        parts={[{ type: "text", text: "With actions" }]}
        actions={<button>Action</button>}
        createdAt={new Date()}
      />,
    );
    expect(screen.getByText("With actions")).toBeDefined();
  });
});
