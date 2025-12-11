import FeatureCard from "@/components/ui/featureCard";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("FeatureCard", () => {
  describe("Renderizado básico", () => {
    it("Renderiza con título básico", () => {
      render(<FeatureCard title="Test Title" />);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("Renderiza con título y descripción", () => {
      render(<FeatureCard title="Title" description="Description text" />);
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description text")).toBeInTheDocument();
    });

    it("Renderiza sin descripción cuando no se proporciona", () => {
      const { container } = render(<FeatureCard title="No Desc" />);
      expect(screen.getByText("No Desc")).toBeInTheDocument();
      expect(container.querySelector(".text-xs.sm\\:text-sm")).toBeNull();
    });

    it("Renderiza con icon", () => {
      render(<FeatureCard title="With Icon" icon="IconHeart" />);
      expect(screen.getByText("With Icon")).toBeInTheDocument();
    });

    it("Renderiza sin icon cuando no se proporciona", () => {
      const { container } = render(<FeatureCard title="No Icon" />);
      expect(screen.getByText("No Icon")).toBeInTheDocument();
      expect(container.querySelector(".text-xl.shrink-0")).toBeNull();
    });

    it("Renderiza con iconLabel para accesibilidad", () => {
      render(
        <FeatureCard title="Title" icon="IconHeart" iconLabel="Favorito" />,
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
    });
  });

  describe("Details", () => {
    it("Renderiza bigDetails cuando bigDetails=true y details existe", () => {
      const { container } = render(
        <FeatureCard title="Title" bigDetails details="100" />,
      );
      const bigDetailsElement = container.querySelector("#big-details");
      expect(bigDetailsElement).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("Renderiza details normales cuando bigDetails=false", () => {
      const { container } = render(
        <FeatureCard title="Title" bigDetails={false} details="Small text" />,
      );
      const detailsElement = container.querySelector("#details");
      expect(detailsElement).toBeInTheDocument();
      expect(screen.getByText("Small text")).toBeInTheDocument();
    });

    it("No renderiza details cuando bigDetails=true pero details no existe", () => {
      const { container } = render(<FeatureCard title="Title" bigDetails />);
      const bigDetailsElement = container.querySelector("#big-details");
      expect(bigDetailsElement).toBeNull();
    });

    it("No renderiza details cuando details no se proporciona", () => {
      const { container } = render(<FeatureCard title="Title" />);
      expect(container.querySelector("#big-details")).toBeNull();
      expect(container.querySelector("#details")).toBeNull();
    });

    it("No renderiza details cuando chart=true", () => {
      const { container } = render(
        <FeatureCard title="Title" details="Test" chart />,
      );
      const detailsElement = container.querySelector("#details");
      expect(detailsElement).toBeNull();
    });

    it("Renderiza details normales cuando chart=false", () => {
      const { container } = render(
        <FeatureCard title="Title" details="Test" chart={false} />,
      );
      const detailsElement = container.querySelector("#details");
      expect(detailsElement).toBeInTheDocument();
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("Children", () => {
    it("Renderiza children cuando se proporciona", () => {
      render(
        <FeatureCard title="Title">
          <div>Child content</div>
        </FeatureCard>,
      );
      expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("No renderiza children cuando no se proporciona", () => {
      const { container } = render(<FeatureCard title="Title" />);
      const contentElements = container.querySelectorAll(".pt-0");
      expect(contentElements.length).toBe(0);
    });

    it("Renderiza children junto con bigDetails", () => {
      render(
        <FeatureCard title="Title" bigDetails details="100">
          <p>Extra content</p>
        </FeatureCard>,
      );
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("Extra content")).toBeInTheDocument();
    });

    it("Renderiza children junto con details normales", () => {
      render(
        <FeatureCard title="Title" details="Small">
          <p>Extra content</p>
        </FeatureCard>,
      );
      expect(screen.getByText("Small")).toBeInTheDocument();
      expect(screen.getByText("Extra content")).toBeInTheDocument();
    });
  });

  describe("Props opcionales", () => {
    it("Renderiza con className personalizado", () => {
      const { container } = render(
        <FeatureCard title="Title" className="custom-class" />,
      );
      const card = container.querySelector(".custom-class");
      expect(card).toBeInTheDocument();
    });

    it("Usa className vacío por defecto", () => {
      render(<FeatureCard title="Title" />);
      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("Usa bigDetails=false por defecto", () => {
      const { container } = render(
        <FeatureCard title="Title" details="Test" />,
      );
      const normalDetails = container.querySelector("#details");
      expect(normalDetails).toBeInTheDocument();
    });

    it("Usa chart=false por defecto", () => {
      const { container } = render(
        <FeatureCard title="Title" details="Test" />,
      );
      const detailsElement = container.querySelector("#details");
      expect(detailsElement).toBeInTheDocument();
    });
  });

  describe("Casos borde", () => {
    it("Renderiza con todas las props combinadas", () => {
      render(
        <FeatureCard
          title="Full Props"
          description="Full description"
          icon="IconHeart"
          iconLabel="Heart icon"
          bigDetails
          details="999"
          className="custom"
          chart={false}
        >
          <div>Children</div>
        </FeatureCard>,
      );
      expect(screen.getByText("Full Props")).toBeInTheDocument();
      expect(screen.getByText("Full description")).toBeInTheDocument();
      expect(screen.getByText("999")).toBeInTheDocument();
      expect(screen.getByText("Children")).toBeInTheDocument();
    });

    it("Maneja details con saltos de línea (whitespace-pre-line)", () => {
      render(
        <FeatureCard
          title="Title"
          details="Line 1{'\n'}Line 2"
          chart={false}
        />,
      );
      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    });

    it("Maneja description como null", () => {
      const { container } = render(
        <FeatureCard title="Title" description={null as unknown as string} />,
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(container.querySelector(".text-xs.sm\\:text-sm")).toBeNull();
    });

    it("Maneja icon como null", () => {
      const { container } = render(
        <FeatureCard title="Title" icon={null as unknown as string} />,
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(container.querySelector(".text-xl.shrink-0")).toBeNull();
    });

    it("Maneja details como string vacío", () => {
      const { container } = render(
        <FeatureCard title="Title" details="" chart={false} />,
      );
      expect(container.querySelector("#details")).toBeNull();
    });

    it("Prioriza bigDetails sobre details normales", () => {
      const { container } = render(
        <FeatureCard title="Title" bigDetails details="100" />,
      );
      expect(container.querySelector("#big-details")).toBeInTheDocument();
      expect(container.querySelector("#details")).toBeNull();
    });

    it("Renderiza children=false (boolean)", () => {
      const { container } = render(
        <FeatureCard title="Title">{false}</FeatureCard>,
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      const contentElements = container.querySelectorAll(".pt-0");
      expect(contentElements.length).toBe(0);
    });

    it("Renderiza children=null", () => {
      const { container } = render(
        <FeatureCard title="Title">{null}</FeatureCard>,
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      const contentElements = container.querySelectorAll(".pt-0");
      expect(contentElements.length).toBe(0);
    });

    it("Combina chart=true con bigDetails", () => {
      const { container } = render(
        <FeatureCard title="Title" bigDetails details="100" chart />,
      );
      expect(container.querySelector("#big-details")).toBeInTheDocument();
    });

    it("Maneja icon sin iconLabel", () => {
      render(<FeatureCard title="Title" icon="IconHeart" />);
      expect(screen.getByText("Title")).toBeInTheDocument();
    });
  });
});
