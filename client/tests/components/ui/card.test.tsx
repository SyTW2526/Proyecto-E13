import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Card", () => {
  it("Renderiza correctamente el componente Card", () => {
    const { container } = render(<Card>Contenido</Card>);

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent("Contenido");
  });

  it("Aplica clases personalizadas al Card", () => {
    const { container } = render(
      <Card className="custom-class">Contenido</Card>,
    );

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass("custom-class");
  });

  it("Renderiza CardHeader correctamente", () => {
    const { container } = render(<CardHeader>Header</CardHeader>);

    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Header");
  });

  it("Aplica clases personalizadas al CardHeader", () => {
    const { container } = render(
      <CardHeader className="custom-header">Header</CardHeader>,
    );

    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toHaveClass("custom-header");
  });

  it("Renderiza CardTitle correctamente", () => {
    const { container } = render(<CardTitle>Título</CardTitle>);

    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Título");
  });

  it("Aplica clases personalizadas al CardTitle", () => {
    const { container } = render(
      <CardTitle className="custom-title">Título</CardTitle>,
    );

    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toHaveClass("custom-title");
  });

  it("Renderiza CardDescription correctamente", () => {
    const { container } = render(
      <CardDescription>Descripción</CardDescription>,
    );

    const description = container.querySelector(
      '[data-slot="card-description"]',
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent("Descripción");
  });

  it("Aplica clases personalizadas al CardDescription", () => {
    const { container } = render(
      <CardDescription className="custom-desc">Descripción</CardDescription>,
    );

    const description = container.querySelector(
      '[data-slot="card-description"]',
    );
    expect(description).toHaveClass("custom-desc");
  });

  it("Renderiza CardAction correctamente", () => {
    const { container } = render(<CardAction>Acción</CardAction>);

    const action = container.querySelector('[data-slot="card-action"]');
    expect(action).toBeInTheDocument();
    expect(action).toHaveTextContent("Acción");
  });

  it("Aplica clases personalizadas al CardAction", () => {
    const { container } = render(
      <CardAction className="custom-action">Acción</CardAction>,
    );

    const action = container.querySelector('[data-slot="card-action"]');
    expect(action).toHaveClass("custom-action");
  });

  it("Renderiza CardContent correctamente", () => {
    const { container } = render(<CardContent>Contenido</CardContent>);

    const content = container.querySelector('[data-slot="card-content"]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent("Contenido");
  });

  it("Aplica clases personalizadas al CardContent", () => {
    const { container } = render(
      <CardContent className="custom-content">Contenido</CardContent>,
    );

    const content = container.querySelector('[data-slot="card-content"]');
    expect(content).toHaveClass("custom-content");
  });

  it("Renderiza una tarjeta completa con todos los componentes", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Título de la tarjeta</CardTitle>
          <CardDescription>Descripción de la tarjeta</CardDescription>
          <CardAction>
            <button>Acción</button>
          </CardAction>
        </CardHeader>
        <CardContent>Contenido principal</CardContent>
      </Card>,
    );

    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="card-header"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="card-title"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="card-description"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="card-action"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="card-content"]'),
    ).toBeInTheDocument();
  });

  it("Maneja props adicionales correctamente", () => {
    const { container } = render(
      <Card data-testid="test-card">Contenido</Card>,
    );

    const card = container.querySelector('[data-testid="test-card"]');
    expect(card).toBeInTheDocument();
  });

  // Edge Cases / Casos Borde
  describe("Edge Cases", () => {
    it("Renderiza Card sin children", () => {
      const { container } = render(<Card />);
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });

    it("Renderiza CardHeader sin children", () => {
      const { container } = render(<CardHeader />);
      const header = container.querySelector('[data-slot="card-header"]');
      expect(header).toBeInTheDocument();
    });

    it("Renderiza CardTitle sin children", () => {
      const { container } = render(<CardTitle />);
      const title = container.querySelector('[data-slot="card-title"]');
      expect(title).toBeInTheDocument();
    });

    it("Renderiza CardDescription sin children", () => {
      const { container } = render(<CardDescription />);
      const description = container.querySelector(
        '[data-slot="card-description"]',
      );
      expect(description).toBeInTheDocument();
    });

    it("Renderiza CardContent sin children", () => {
      const { container } = render(<CardContent />);
      const content = container.querySelector('[data-slot="card-content"]');
      expect(content).toBeInTheDocument();
    });

    it("Renderiza CardAction sin children", () => {
      const { container } = render(<CardAction />);
      const action = container.querySelector('[data-slot="card-action"]');
      expect(action).toBeInTheDocument();
    });

    it("Maneja múltiples CardActions en el mismo header", () => {
      const { container } = render(
        <CardHeader>
          <CardAction>Acción 1</CardAction>
          <CardAction>Acción 2</CardAction>
          <CardAction>Acción 3</CardAction>
        </CardHeader>,
      );

      const actions = container.querySelectorAll('[data-slot="card-action"]');
      expect(actions).toHaveLength(3);
    });

    it("Renderiza Card con solo CardContent", () => {
      const { container } = render(
        <Card>
          <CardContent>Solo contenido</CardContent>
        </Card>,
      );

      const card = container.querySelector('[data-slot="card"]');
      const content = container.querySelector('[data-slot="card-content"]');
      expect(card).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("Maneja Card con className undefined", () => {
      const { container } = render(
        <Card className={undefined}>Contenido</Card>,
      );

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });

    it("Renderiza CardHeader con solo CardAction", () => {
      const { container } = render(
        <CardHeader>
          <CardAction>Solo acción</CardAction>
        </CardHeader>,
      );

      const header = container.querySelector('[data-slot="card-header"]');
      const action = container.querySelector('[data-slot="card-action"]');
      expect(header).toBeInTheDocument();
      expect(action).toBeInTheDocument();
    });

    it("Maneja contenido complejo en CardContent", () => {
      const { container } = render(
        <CardContent>
          <div>
            <p>Párrafo 1</p>
            <p>Párrafo 2</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </CardContent>,
      );

      const content = container.querySelector('[data-slot="card-content"]');
      expect(content).toBeInTheDocument();
    });

    it("Renderiza Card con solo Header sin Content", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Título</CardTitle>
          </CardHeader>
        </Card>,
      );

      const card = container.querySelector('[data-slot="card"]');
      const header = container.querySelector('[data-slot="card-header"]');
      const content = container.querySelector('[data-slot="card-content"]');

      expect(card).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(content).not.toBeInTheDocument();
    });

    it("Maneja CardTitle con children como número 0", () => {
      const { container } = render(<CardTitle>{0}</CardTitle>);
      const title = container.querySelector('[data-slot="card-title"]');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("0");
    });

    it("Renderiza múltiples Cards anidados", () => {
      const { container } = render(
        <Card>
          <CardContent>
            <Card>
              <CardContent>Nested Card</CardContent>
            </Card>
          </CardContent>
        </Card>,
      );

      const cards = container.querySelectorAll('[data-slot="card"]');
      expect(cards).toHaveLength(2);
    });

    it("Combina todas las clases personalizadas en todos los componentes", () => {
      const { container } = render(
        <Card className="card-class">
          <CardHeader className="header-class">
            <CardTitle className="title-class">Título</CardTitle>
            <CardDescription className="desc-class">Desc</CardDescription>
            <CardAction className="action-class">Acción</CardAction>
          </CardHeader>
          <CardContent className="content-class">Content</CardContent>
        </Card>,
      );

      expect(container.querySelector('[data-slot="card"]')).toHaveClass(
        "card-class",
      );
      expect(container.querySelector('[data-slot="card-header"]')).toHaveClass(
        "header-class",
      );
      expect(container.querySelector('[data-slot="card-title"]')).toHaveClass(
        "title-class",
      );
      expect(
        container.querySelector('[data-slot="card-description"]'),
      ).toHaveClass("desc-class");
      expect(container.querySelector('[data-slot="card-action"]')).toHaveClass(
        "action-class",
      );
      expect(container.querySelector('[data-slot="card-content"]')).toHaveClass(
        "content-class",
      );
    });
  });
});
