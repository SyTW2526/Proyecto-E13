import { Input } from "@/components/ui/input";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Input", () => {
  it("Renderiza correctamente el componente Input", () => {
    const { container } = render(<Input />);
    const input = container.querySelector('[data-slot="input"]');
    expect(input).toBeInTheDocument();
  });

  it("Aplica clases personalizadas", () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector('[data-slot="input"]');
    expect(input).toHaveClass("custom-class");
  });

  it("Renderiza con type text por defecto", () => {
    render(<Input data-testid="test-input" />);
    const input = screen.getByTestId("test-input");
    expect(input).toBeInTheDocument();
  });

  it("Renderiza con type password", () => {
    render(<Input type="password" data-testid="password-input" />);
    const input = screen.getByTestId("password-input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("Renderiza con type email", () => {
    render(<Input type="email" data-testid="email-input" />);
    const input = screen.getByTestId("email-input");
    expect(input).toHaveAttribute("type", "email");
  });

  it("Maneja el atributo placeholder", () => {
    render(<Input placeholder="Enter text" data-testid="placeholder-input" />);
    const input = screen.getByTestId("placeholder-input");
    expect(input).toHaveAttribute("placeholder", "Enter text");
  });

  it("Maneja el atributo disabled", () => {
    render(<Input disabled data-testid="disabled-input" />);
    const input = screen.getByTestId("disabled-input");
    expect(input).toBeDisabled();
  });

  it("Maneja el atributo required", () => {
    render(<Input required data-testid="required-input" />);
    const input = screen.getByTestId("required-input");
    expect(input).toBeRequired();
  });

  it("Maneja onChange correctamente", async () => {
    const user = userEvent.setup();
    render(<Input data-testid="change-input" />);
    const input = screen.getByTestId("change-input") as HTMLInputElement;

    await user.type(input, "Hello");
    expect(input.value).toBe("Hello");
  });

  it("Maneja el atributo value", () => {
    render(<Input value="Initial value" readOnly data-testid="value-input" />);
    const input = screen.getByTestId("value-input") as HTMLInputElement;
    expect(input.value).toBe("Initial value");
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("Maneja className undefined", () => {
      const { container } = render(<Input className={undefined} />);
      const input = container.querySelector('[data-slot="input"]');
      expect(input).toBeInTheDocument();
    });

    it("Maneja type undefined", () => {
      render(<Input type={undefined} data-testid="undefined-type" />);
      const input = screen.getByTestId("undefined-type");
      expect(input).toBeInTheDocument();
    });

    it("Renderiza con múltiples clases", () => {
      const { container } = render(<Input className="class1 class2 class3" />);
      const input = container.querySelector('[data-slot="input"]');
      expect(input).toHaveClass("class1", "class2", "class3");
    });

    it("Maneja type number", () => {
      render(<Input type="number" data-testid="number-input" />);
      const input = screen.getByTestId("number-input");
      expect(input).toHaveAttribute("type", "number");
    });

    it("Maneja type file", () => {
      render(<Input type="file" data-testid="file-input" />);
      const input = screen.getByTestId("file-input");
      expect(input).toHaveAttribute("type", "file");
    });

    it("Maneja readOnly", () => {
      render(<Input readOnly data-testid="readonly-input" />);
      const input = screen.getByTestId("readonly-input");
      expect(input).toHaveAttribute("readonly");
    });

    it("Maneja maxLength", () => {
      render(<Input maxLength={10} data-testid="maxlength-input" />);
      const input = screen.getByTestId("maxlength-input");
      expect(input).toHaveAttribute("maxLength", "10");
    });

    it("Maneja minLength", () => {
      render(<Input minLength={5} data-testid="minlength-input" />);
      const input = screen.getByTestId("minlength-input");
      expect(input).toHaveAttribute("minLength", "5");
    });

    it("Maneja aria-invalid", () => {
      render(<Input aria-invalid="true" data-testid="invalid-input" />);
      const input = screen.getByTestId("invalid-input");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("Maneja autoComplete", () => {
      render(<Input autoComplete="email" data-testid="autocomplete-input" />);
      const input = screen.getByTestId("autocomplete-input");
      expect(input).toHaveAttribute("autoComplete", "email");
    });

    it("Maneja autoFocus", () => {
      render(<Input autoFocus data-testid="autofocus-input" />);
      const input = screen.getByTestId("autofocus-input");
      expect(input).toHaveFocus();
    });

    it("Combina todas las props", () => {
      render(
        <Input
          type="email"
          placeholder="Email"
          required
          className="custom"
          data-testid="combo-input"
        />,
      );
      const input = screen.getByTestId("combo-input");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "email");
      expect(input).toBeRequired();
      expect(input).toHaveClass("custom");
    });
  });
});
