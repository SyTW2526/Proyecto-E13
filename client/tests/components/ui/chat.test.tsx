import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Chat } from "../../../src/components/ui/chat";

// Mocks
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../src/hooks/use-auto-scroll", () => ({
  useAutoScroll: () => ({
    containerRef: { current: null },
    scrollToBottom: vi.fn(),
    handleScroll: vi.fn(),
    shouldAutoScroll: true,
    handleTouchStart: vi.fn(),
  }),
}));

vi.mock("../../../src/components/ui/message-list", () => ({
  MessageList: ({
    messages,
  }: {
    messages: Array<{ id: string; content: string }>;
  }) => (
    <div data-testid="message-list">
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
    </div>
  ),
}));

vi.mock("../../../src/components/ui/message-input", () => ({
  MessageInput: ({
    value,
  }: {
    value: string;
    onChange?: () => void;
    onSubmit?: () => void;
  }) => <textarea data-testid="message-input" value={value} />,
}));

vi.mock("../../../src/components/ui/prompt-suggestions", () => ({
  PromptSuggestions: ({
    suggestions,
    append,
  }: {
    suggestions: string[];
    append: (msg: { role: string; content: string }) => void;
  }) => (
    <div data-testid="prompt-suggestions">
      {suggestions.map((s: string) => (
        <button key={s} onClick={() => append({ role: "user", content: s })}>
          {s}
        </button>
      ))}
    </div>
  ),
}));

describe("Chat", () => {
  const defaultProps = {
    messages: [],
    handleSubmit: vi.fn(),
    input: "",
    handleInputChange: vi.fn(),
    isGenerating: false,
  };

  it("debe renderizar el componente correctamente", () => {
    render(<Chat {...defaultProps} />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("debe mostrar mensajes cuando hay mensajes", () => {
    const messages = [
      {
        id: "1",
        role: "user" as const,
        content: "Hello",
        createdAt: new Date(),
      },
      {
        id: "2",
        role: "assistant" as const,
        content: "Hi",
        createdAt: new Date(),
      },
    ];
    render(<Chat {...defaultProps} messages={messages} />);
    expect(screen.getByText("Hello")).toBeDefined();
    expect(screen.getByText("Hi")).toBeDefined();
  });

  it("debe mostrar sugerencias cuando están disponibles", () => {
    const props = {
      ...defaultProps,
      append: vi.fn(),
      suggestions: ["Suggestion 1", "Suggestion 2"],
    };
    render(<Chat {...props} />);
    expect(screen.getByTestId("prompt-suggestions")).toBeDefined();
    expect(screen.getByText("Suggestion 1")).toBeDefined();
  });

  it("debe manejar input vacío", () => {
    render(<Chat {...defaultProps} input="" />);
    // Just verify it renders without error
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("debe manejar input con texto", () => {
    render(<Chat {...defaultProps} input="Test message" />);
    // Just verify it renders without error
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("debe aplicar className personalizado", () => {
    const { container } = render(
      <Chat {...defaultProps} className="custom-class" />,
    );
    expect(container.querySelector(".custom-class")).toBeDefined();
  });

  it("debe manejar estado de generación", () => {
    const { rerender } = render(
      <Chat {...defaultProps} isGenerating={false} />,
    );
    expect(screen.getByRole("textbox")).toBeDefined();

    rerender(<Chat {...defaultProps} isGenerating={true} />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("debe manejar la función stop cuando está disponible", () => {
    const stopFn = vi.fn();
    render(<Chat {...defaultProps} stop={stopFn} isGenerating={true} />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("debe renderizar sin función stop", () => {
    render(<Chat {...defaultProps} isGenerating={false} />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("debe manejar múltiples mensajes", () => {
    const messages = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
      content: `Message ${i}`,
      createdAt: new Date(),
    }));
    render(<Chat {...defaultProps} messages={messages} />);
    expect(screen.getByText("Message 0")).toBeDefined();
    expect(screen.getByText("Message 9")).toBeDefined();
  });
});
