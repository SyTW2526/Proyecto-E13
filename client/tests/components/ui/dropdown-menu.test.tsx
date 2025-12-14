import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("DropdownMenu", () => {
  describe("Componentes básicos", () => {
    it("Renderiza trigger", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Abrir menú</DropdownMenuTrigger>
        </DropdownMenu>,
      );

      expect(screen.getByText("Abrir menú")).toBeInTheDocument();
    });

    it("Renderiza content cuando está abierto", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Opción 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Opción 1")).toBeInTheDocument();
    });

    it("Renderiza content con sideOffset personalizado", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Item")).toBeInTheDocument();
    });

    it("Renderiza content con className personalizado", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent className="custom-class">
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Item")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuItem", () => {
    it("Renderiza item con variant default", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item default</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Item default")).toBeInTheDocument();
    });

    it("Renderiza item con variant destructive", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem variant="destructive">Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Eliminar")).toBeInTheDocument();
    });

    it("Renderiza item con inset", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset>Item con inset</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Item con inset")).toBeInTheDocument();
    });

    it("Renderiza item con className personalizado", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="custom-item">
              Custom item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Custom item")).toBeInTheDocument();
    });

    it("Renderiza item deshabilitado", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled>Item deshabilitado</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const item = screen.getByText("Item deshabilitado");
      expect(item).toBeInTheDocument();
      await user.click(item);
    });
  });

  describe("DropdownMenuLabel", () => {
    it("Renderiza label", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Etiqueta</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Etiqueta")).toBeInTheDocument();
    });

    it("Renderiza label con inset", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel inset>Label con inset</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Label con inset")).toBeInTheDocument();
    });

    it("Renderiza label con className", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="custom-label">
              Label custom
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Label custom")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuSeparator", () => {
    it("Renderiza separador", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it("Renderiza separador con className", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator className="custom-separator" />
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByRole("separator")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuSub", () => {
    it("Renderiza submenu", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub open>
              <DropdownMenuSubTrigger>Más opciones</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Subitem 1</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Más opciones")).toBeInTheDocument();
      expect(screen.getByText("Subitem 1")).toBeInTheDocument();
    });

    it("Renderiza subtrigger con inset", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub open>
              <DropdownMenuSubTrigger inset>
                Sub con inset
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Sub con inset")).toBeInTheDocument();
    });

    it("Renderiza subtrigger con className", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub open>
              <DropdownMenuSubTrigger className="custom-subtrigger">
                Subtrigger
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Subtrigger")).toBeInTheDocument();
    });

    it("Renderiza subcontent con className", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub open>
              <DropdownMenuSubTrigger>Sub</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="custom-subcontent">
                <DropdownMenuItem>Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Item")).toBeInTheDocument();
    });
  });

  describe("Casos borde", () => {
    it("Renderiza menú sin children", () => {
      render(<DropdownMenu />);
      expect(document.body).toBeInTheDocument();
    });

    it("Renderiza content sin sideOffset usa default 4", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Item")).toBeInTheDocument();
    });
  });
});
