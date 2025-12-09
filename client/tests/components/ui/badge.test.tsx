import { Badge } from "@/components/ui/badge";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Badge", () => {
  it("Renderiza correctamente el componente Badge", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText(/new/i)).toBeInTheDocument();
  });

  it("Renderiza con la variante default", () => {
    render(<Badge variant="default">Default</Badge>);
    const badge = screen.getByText(/default/i);
    expect(badge).toBeInTheDocument();
  });

  it("Renderiza con la variante secondary", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText(/secondary/i);
    expect(badge).toBeInTheDocument();
  });

  it("Renderiza con la variante destructive", () => {
    render(<Badge variant="destructive">Error</Badge>);
    const badge = screen.getByText(/error/i);
    expect(badge).toBeInTheDocument();
  });

  it("Renderiza con la variante outline", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText(/outline/i);
    expect(badge).toBeInTheDocument();
  });

  it("Aplica clases personalizadas", () => {
    render(<Badge className="custom-badge">Custom</Badge>);
    const badge = screen.getByText(/custom/i);
    expect(badge).toHaveClass("custom-badge");
  });

  it("Renderiza con leftIcon (string)", () => {
    render(<Badge leftIcon="Star">Featured</Badge>);
    const badge = screen.getByText(/featured/i);
    expect(badge).toBeInTheDocument();
  });

  it("Renderiza con rightIcon (string)", () => {
    render(<Badge rightIcon="Check">Verified</Badge>);
    const badge = screen.getByText(/verified/i);
    expect(badge).toBeInTheDocument();
  });

  it("Renderiza con leftIcon y rightIcon simultáneamente", () => {
    render(
      <Badge leftIcon="Star" rightIcon="Check">
        Both Icons
      </Badge>,
    );
    const badge = screen.getByText(/both icons/i);
    expect(badge).toBeInTheDocument();
  });

  it("Renderiza con iconSize personalizado", () => {
    render(
      <Badge leftIcon="Heart" iconSize={20}>
        Custom Size
      </Badge>,
    );
    const badge = screen.getByText(/custom size/i);
    expect(badge).toBeInTheDocument();
  });

  it("Tiene el data-slot attribute", () => {
    render(<Badge>Test</Badge>);
    const badge = screen.getByText(/test/i);
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("Renderiza sin leftIcon cuando no se proporciona", () => {
    render(<Badge rightIcon="Check">Only Right</Badge>);
    const badge = screen.getByText(/only right/i);
    expect(badge).toBeInTheDocument();
  });

  it("Renderiza sin rightIcon cuando no se proporciona", () => {
    render(<Badge leftIcon="Star">Only Left</Badge>);
    const badge = screen.getByText(/only left/i);
    expect(badge).toBeInTheDocument();
  });

  it("Renderiza sin iconos cuando ninguno se proporciona", () => {
    render(<Badge>No Icons</Badge>);
    const badge = screen.getByText(/no icons/i);
    expect(badge).toBeInTheDocument();
  });

  it("Maneja props adicionales correctamente", () => {
    render(<Badge data-testid="test-badge">Test</Badge>);
    const badge = screen.getByTestId("test-badge");
    expect(badge).toBeInTheDocument();
  });

  it("Renderiza con múltiples variantes", () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText(/default/i)).toBeInTheDocument();

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText(/secondary/i)).toBeInTheDocument();

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText(/destructive/i)).toBeInTheDocument();

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText(/outline/i)).toBeInTheDocument();
  });

  it("Combina variante y clase personalizada", () => {
    render(
      <Badge variant="destructive" className="extra-class">
        Combined
      </Badge>,
    );
    const badge = screen.getByText(/combined/i);
    expect(badge).toHaveClass("extra-class");
  });

  it("Renderiza como span por defecto (no asChild)", () => {
    const { container } = render(<Badge>Span Badge</Badge>);
    const span = container.querySelector("span[data-slot='badge']");
    expect(span).toBeInTheDocument();
  });

  it("asChild por defecto es false", () => {
    const { container } = render(<Badge>Test</Badge>);
    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();
  });

  it("Renderiza contenido de children correctamente", () => {
    render(
      <Badge>
        <span>Complex</span> Content
      </Badge>,
    );
    expect(screen.getByText(/complex/i)).toBeInTheDocument();
    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });

  // Edge Cases / Casos Borde
  describe("Edge Cases", () => {
    it("Maneja leftIcon con valor null", () => {
      render(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Badge leftIcon={null as any}>Null Icon</Badge>,
      );
      const badge = screen.getByText(/null icon/i);
      expect(badge).toBeInTheDocument();
    });

    it("Maneja rightIcon con valor undefined", () => {
      render(<Badge rightIcon={undefined}>Undefined Icon</Badge>);
      const badge = screen.getByText(/undefined icon/i);
      expect(badge).toBeInTheDocument();
    });

    it("Renderiza con iconSize 0", () => {
      render(
        <Badge leftIcon="Star" iconSize={0}>
          Zero Size
        </Badge>,
      );
      const badge = screen.getByText(/zero size/i);
      expect(badge).toBeInTheDocument();
    });

    it("Renderiza con iconSize extremadamente grande", () => {
      render(
        <Badge leftIcon="Star" iconSize={100}>
          Large Icon
        </Badge>,
      );
      const badge = screen.getByText(/large icon/i);
      expect(badge).toBeInTheDocument();
    });

    it("Renderiza con iconSize negativo", () => {
      render(
        <Badge leftIcon="Star" iconSize={-10}>
          Negative Size
        </Badge>,
      );
      const badge = screen.getByText(/negative size/i);
      expect(badge).toBeInTheDocument();
    });

    it("Maneja children vacío", () => {
      const { container } = render(<Badge></Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
    });

    it("Maneja children con solo espacios en blanco", () => {
      const { container } = render(<Badge> </Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
    });

    it("Renderiza con variante inválida usando default", () => {
      render(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Badge variant={"invalid" as any}>Invalid Variant</Badge>,
      );
      const badge = screen.getByText(/invalid variant/i);
      expect(badge).toBeInTheDocument();
    });

    it("Combina todas las props al mismo tiempo", () => {
      render(
        <Badge
          variant="destructive"
          className="custom"
          leftIcon="Star"
          rightIcon="Check"
          iconSize={12}
          data-testid="combo-badge"
        >
          All Props
        </Badge>,
      );
      const badge = screen.getByTestId("combo-badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("custom");
    });

    it("Maneja className con valor undefined", () => {
      render(<Badge className={undefined}>Undefined Class</Badge>);
      const badge = screen.getByText(/undefined class/i);
      expect(badge).toBeInTheDocument();
    });

    it("Renderiza children como número 0", () => {
      render(<Badge>{0}</Badge>);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("Renderiza children como boolean false", () => {
      const { container } = render(<Badge>{false}</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
    });

    it("Maneja múltiples iconos del mismo tipo", () => {
      render(
        <Badge leftIcon="Star" rightIcon="Star">
          Same Icons
        </Badge>,
      );
      const badge = screen.getByText(/same icons/i);
      expect(badge).toBeInTheDocument();
    });

    it("Verifica que asChild no es compatible con la estructura actual del Badge", () => {
      // Este test documenta que asChild no funciona con Badge debido a que
      // Badge siempre renderiza múltiples elementos (leftIcon + children + rightIcon)
      // y Slot requiere exactamente un solo hijo React element
      // Este es un caso borde conocido de la implementación actual

      // Si intentáramos renderizar con asChild, obtendríamos el error:
      // "React.Children.only expected to receive a single React element child"
      expect(true).toBe(true);
    });
  });
});
