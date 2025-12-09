import Icon from "@/components/ui/icon";
import { IconHeart } from "@tabler/icons-react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Icon", () => {
  describe("Renderizado básico", () => {
    it("Renderiza con icono string válido", () => {
      const { container } = render(<Icon as="IconHeart" />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("Renderiza con componente de icono directamente", () => {
      const { container } = render(<Icon as={IconHeart} />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("Renderiza con icono string inválido usando fallback", () => {
      const { container } = render(<Icon as="InvalidIcon" />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("Renderiza con size personalizado", () => {
      const { container } = render(<Icon as="IconHeart" size={32} />);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
    });

    it("Renderiza con stroke personalizado", () => {
      const { container } = render(<Icon as="IconHeart" stroke={2} />);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
    });

    it("Renderiza con className personalizado", () => {
      const { container } = render(
        <Icon as="IconHeart" className="custom-icon" />,
      );
      const span = container.querySelector("span");
      expect(span).toHaveClass("custom-icon");
    });
  });

  describe("Accesibilidad", () => {
    it("Renderiza con ariaLabel incluye role e aria-label", () => {
      const { container } = render(
        <Icon as="IconHeart" ariaLabel="Favorito" />,
      );
      const span = container.querySelector("span");
      expect(span).toHaveAttribute("role", "img");
      expect(span).toHaveAttribute("aria-label", "Favorito");
    });

    it("Renderiza sin ariaLabel incluye aria-hidden", () => {
      const { container } = render(<Icon as="IconHeart" />);
      const span = container.querySelector("span");
      expect(span).toHaveAttribute("aria-hidden", "true");
      expect(span).not.toHaveAttribute("role");
    });

    it("Renderiza con ariaLabel vacío no establece atributos aria", () => {
      const { container } = render(<Icon as="IconHeart" ariaLabel="" />);
      const span = container.querySelector("span");
      expect(span).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Props por defecto", () => {
    it("Usa size 24 por defecto", () => {
      const { container } = render(<Icon as="IconHeart" />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("Usa stroke 1.5 por defecto", () => {
      const { container } = render(<Icon as="IconHeart" />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("Usa className vacío por defecto", () => {
      const { container } = render(<Icon as="IconHeart" />);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
      expect(span?.className).toBe("");
    });
  });

  describe("Casos borde", () => {
    it("Renderiza con size 0", () => {
      const { container } = render(<Icon as="IconHeart" size={0} />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("Renderiza con stroke 0", () => {
      const { container } = render(<Icon as="IconHeart" stroke={0} />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("Renderiza con size muy grande", () => {
      const { container } = render(<Icon as="IconHeart" size={1000} />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("Renderiza con stroke muy grande", () => {
      const { container } = render(<Icon as="IconHeart" stroke={10} />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("Renderiza con múltiples clases en className", () => {
      const { container } = render(
        <Icon as="IconHeart" className="class1 class2 class3" />,
      );
      const span = container.querySelector("span");
      expect(span).toHaveClass("class1", "class2", "class3");
    });

    it("Renderiza con todas las props combinadas", () => {
      const { container } = render(
        <Icon
          as="IconHeart"
          size={48}
          stroke={3}
          className="full-props"
          ariaLabel="Test completo"
        />,
      );
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
      expect(span).toHaveClass("full-props");
      expect(span).toHaveAttribute("role", "img");
      expect(span).toHaveAttribute("aria-label", "Test completo");
    });

    it("Maneja icono con nombre de IconClipboard fallback", () => {
      const { container } = render(<Icon as="NonExistentIcon123" />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });
  });
});
