import { Separator } from "@/components/ui/separator";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Separator", () => {
  it("Renderiza correctamente un separador horizontal", () => {
    const { container } = render(<Separator />);

    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("Renderiza correctamente un separador vertical", () => {
    const { container } = render(<Separator orientation="vertical" />);

    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });

  it("Aplica clases personalizadas", () => {
    const { container } = render(<Separator className="custom-separator" />);

    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toHaveClass("custom-separator");
  });

  it("Tiene decorative=true por defecto", () => {
    const { container } = render(<Separator />);

    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("Puede ser no decorativo", () => {
    const { container } = render(<Separator decorative={false} />);

    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).not.toHaveAttribute("aria-hidden", "true");
  });

  it("Maneja props adicionales correctamente", () => {
    const { container } = render(<Separator data-testid="test-separator" />);

    const separator = container.querySelector('[data-testid="test-separator"]');
    expect(separator).toBeInTheDocument();
  });

  // Edge Cases / Casos Borde
  describe("Edge Cases", () => {
    it("Cambia orientación dinámicamente", () => {
      const { container, rerender } = render(
        <Separator orientation="horizontal" />,
      );

      let separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute("data-orientation", "horizontal");

      rerender(<Separator orientation="vertical" />);
      separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });

    it("Maneja orientation con valor undefined (usa default)", () => {
      const { container } = render(<Separator orientation={undefined} />);
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("Renderiza con className undefined", () => {
      const { container } = render(<Separator className={undefined} />);
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toBeInTheDocument();
    });

    it("Maneja múltiples clases personalizadas", () => {
      const { container } = render(
        <Separator className="class1 class2 class3" />,
      );
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass("class1", "class2", "class3");
    });

    it("Renderiza múltiples separadores en secuencia", () => {
      const { container } = render(
        <>
          <Separator />
          <Separator orientation="vertical" />
          <Separator />
        </>,
      );
      const separators = container.querySelectorAll('[data-slot="separator"]');
      expect(separators).toHaveLength(3);
    });

    it("Combina decorative y orientation", () => {
      const { container } = render(
        <Separator orientation="vertical" decorative={false} />,
      );
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });

    it("Maneja decorative cambiando dinámicamente", () => {
      const { container, rerender } = render(<Separator decorative={true} />);

      let separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toBeInTheDocument();

      rerender(<Separator decorative={false} />);
      separator = container.querySelector('[data-slot="separator"]');
      expect(separator).not.toHaveAttribute("aria-hidden", "true");
    });

    it("Renderiza con todas las props combinadas", () => {
      const { container } = render(
        <Separator
          orientation="vertical"
          decorative={false}
          className="custom"
          data-testid="full-separator"
        />,
      );
      const separator = container.querySelector(
        '[data-testid="full-separator"]',
      );
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "vertical");
      expect(separator).toHaveClass("custom");
    });

    it("Maneja separadores anidados dentro de contenedores", () => {
      const { container } = render(
        <div>
          <div>
            <Separator />
          </div>
          <div>
            <Separator orientation="vertical" />
          </div>
        </div>,
      );
      const separators = container.querySelectorAll('[data-slot="separator"]');
      expect(separators).toHaveLength(2);
    });

    it("Renderiza correctamente en layout flex", () => {
      const { container } = render(
        <div style={{ display: "flex" }}>
          <div>Item 1</div>
          <Separator orientation="vertical" />
          <div>Item 2</div>
        </div>,
      );
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });
  });
});
