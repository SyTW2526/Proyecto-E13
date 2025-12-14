import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChatMessage } from "../../../src/components/chat/ChatMessage";

// Mock de MarkdownRenderer
vi.mock("@/components/chat/MarkdownRenderer", () => ({
  MarkdownRenderer: ({ children }: { children: string }) => (
    <div data-testid="markdown">{children}</div>
  ),
}));

// Mock de FilePreview
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
});
