import { Textarea } from "@/components/ui/textarea";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Textarea", () => {
  it("Renderiza correctamente el componente Textarea", () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector('[data-slot="textarea"]');
    expect(textarea).toBeInTheDocument();
  });

  it("Aplica clases personalizadas", () => {
    const { container } = render(<Textarea className="custom-class" />);
    const textarea = container.querySelector('[data-slot="textarea"]');
    expect(textarea).toHaveClass("custom-class");
  });

  it("Maneja el atributo placeholder", () => {
    render(
      <Textarea placeholder="Enter text" data-testid="placeholder-textarea" />,
    );
    const textarea = screen.getByTestId("placeholder-textarea");
    expect(textarea).toHaveAttribute("placeholder", "Enter text");
  });

  it("Maneja el atributo disabled", () => {
    render(<Textarea disabled data-testid="disabled-textarea" />);
    const textarea = screen.getByTestId("disabled-textarea");
    expect(textarea).toBeDisabled();
  });

  it("Maneja el atributo required", () => {
    render(<Textarea required data-testid="required-textarea" />);
    const textarea = screen.getByTestId("required-textarea");
    expect(textarea).toBeRequired();
  });

  it("Maneja onChange correctamente", async () => {
    const user = userEvent.setup();
    render(<Textarea data-testid="change-textarea" />);
    const textarea = screen.getByTestId(
      "change-textarea",
    ) as HTMLTextAreaElement;

    await user.type(textarea, "Hello World");
    expect(textarea.value).toBe("Hello World");
  });

  it("Maneja el atributo value", () => {
    render(
      <Textarea value="Initial value" readOnly data-testid="value-textarea" />,
    );
    const textarea = screen.getByTestId(
      "value-textarea",
    ) as HTMLTextAreaElement;
    expect(textarea.value).toBe("Initial value");
  });

  it("Maneja rows attribute", () => {
    render(<Textarea rows={5} data-testid="rows-textarea" />);
    const textarea = screen.getByTestId("rows-textarea");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("Maneja cols attribute", () => {
    render(<Textarea cols={50} data-testid="cols-textarea" />);
    const textarea = screen.getByTestId("cols-textarea");
    expect(textarea).toHaveAttribute("cols", "50");
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("Maneja className undefined", () => {
      const { container } = render(<Textarea className={undefined} />);
      const textarea = container.querySelector('[data-slot="textarea"]');
      expect(textarea).toBeInTheDocument();
    });

    it("Maneja múltiples clases", () => {
      const { container } = render(
        <Textarea className="class1 class2 class3" />,
      );
      const textarea = container.querySelector('[data-slot="textarea"]');
      expect(textarea).toHaveClass("class1", "class2", "class3");
    });

    it("Maneja readOnly", () => {
      render(<Textarea readOnly data-testid="readonly-textarea" />);
      const textarea = screen.getByTestId("readonly-textarea");
      expect(textarea).toHaveAttribute("readonly");
    });

    it("Maneja maxLength", () => {
      render(<Textarea maxLength={100} data-testid="maxlength-textarea" />);
      const textarea = screen.getByTestId("maxlength-textarea");
      expect(textarea).toHaveAttribute("maxLength", "100");
    });

    it("Maneja minLength", () => {
      render(<Textarea minLength={10} data-testid="minlength-textarea" />);
      const textarea = screen.getByTestId("minlength-textarea");
      expect(textarea).toHaveAttribute("minLength", "10");
    });

    it("Maneja aria-invalid", () => {
      render(<Textarea aria-invalid="true" data-testid="invalid-textarea" />);
      const textarea = screen.getByTestId("invalid-textarea");
      expect(textarea).toHaveAttribute("aria-invalid", "true");
    });

    it("Maneja autoComplete", () => {
      render(
        <Textarea autoComplete="on" data-testid="autocomplete-textarea" />,
      );
      const textarea = screen.getByTestId("autocomplete-textarea");
      expect(textarea).toHaveAttribute("autoComplete", "on");
    });

    it("Maneja autoFocus", () => {
      render(<Textarea autoFocus data-testid="autofocus-textarea" />);
      const textarea = screen.getByTestId("autofocus-textarea");
      expect(textarea).toHaveFocus();
    });

    it("Maneja defaultValue", () => {
      render(
        <Textarea defaultValue="Default text" data-testid="default-textarea" />,
      );
      const textarea = screen.getByTestId(
        "default-textarea",
      ) as HTMLTextAreaElement;
      expect(textarea.value).toBe("Default text");
    });

    it("Combina todas las props", () => {
      render(
        <Textarea
          placeholder="Message"
          required
          rows={5}
          className="custom"
          data-testid="combo-textarea"
        />,
      );
      const textarea = screen.getByTestId("combo-textarea");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toBeRequired();
      expect(textarea).toHaveAttribute("rows", "5");
      expect(textarea).toHaveClass("custom");
    });

    it("Maneja texto multilínea", async () => {
      const user = userEvent.setup();
      render(<Textarea data-testid="multiline-textarea" />);
      const textarea = screen.getByTestId(
        "multiline-textarea",
      ) as HTMLTextAreaElement;

      await user.type(textarea, "Line 1{Enter}Line 2{Enter}Line 3");
      expect(textarea.value).toContain("\n");
    });
  });
});
