import { Label } from "@/components/ui/label";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Label", () => {
  it("Renderiza correctamente el componente Label", () => {
    const { container } = render(<Label>Label Text</Label>);
    const label = container.querySelector('[data-slot="label"]');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Label Text");
  });

  it("Aplica clases personalizadas", () => {
    const { container } = render(<Label className="custom-class">Label</Label>);
    const label = container.querySelector('[data-slot="label"]');
    expect(label).toHaveClass("custom-class");
  });

  it("Maneja el atributo htmlFor", () => {
    render(<Label htmlFor="input-id">Label</Label>);
    const label = screen.getByText("Label");
    expect(label).toHaveAttribute("for", "input-id");
  });

  it("Renderiza con children de texto", () => {
    render(<Label>Simple Text</Label>);
    expect(screen.getByText("Simple Text")).toBeInTheDocument();
  });

  it("Renderiza con children complejos", () => {
    render(
      <Label>
        <span>Complex</span> Label
      </Label>,
    );
    expect(screen.getByText("Complex")).toBeInTheDocument();
    expect(screen.getByText(/Label/)).toBeInTheDocument();
  });

  it("Maneja props adicionales", () => {
    render(<Label data-testid="test-label">Test</Label>);
    const label = screen.getByTestId("test-label");
    expect(label).toBeInTheDocument();
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("Renderiza sin children", () => {
      const { container } = render(<Label />);
      const label = container.querySelector('[data-slot="label"]');
      expect(label).toBeInTheDocument();
    });

    it("Maneja className undefined", () => {
      const { container } = render(<Label className={undefined}>Label</Label>);
      const label = container.querySelector('[data-slot="label"]');
      expect(label).toBeInTheDocument();
    });

    it("Maneja múltiples clases", () => {
      const { container } = render(
        <Label className="class1 class2 class3">Label</Label>,
      );
      const label = container.querySelector('[data-slot="label"]');
      expect(label).toHaveClass("class1", "class2", "class3");
    });

    it("Renderiza children como número 0", () => {
      render(<Label>{0}</Label>);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("Combina htmlFor con className", () => {
      render(
        <Label htmlFor="test-input" className="custom">
          Combined
        </Label>,
      );
      const label = screen.getByText("Combined");
      expect(label).toHaveAttribute("for", "test-input");
      expect(label).toHaveClass("custom");
    });

    it("Maneja onClick event", () => {
      let clicked = false;
      render(
        <Label
          onClick={() => {
            clicked = true;
          }}
        >
          Clickable
        </Label>,
      );
      const label = screen.getByText("Clickable");
      label.click();
      expect(clicked).toBe(true);
    });

    it("Renderiza con aria-label", () => {
      render(<Label aria-label="Aria Label">Label</Label>);
      const label = screen.getByLabelText("Aria Label");
      expect(label).toBeInTheDocument();
    });
  });
});
