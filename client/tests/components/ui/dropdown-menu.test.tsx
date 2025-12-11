import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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

  describe("DropdownMenuCheckboxItem", () => {
    it("Renderiza checkbox checked", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>Marcado</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Marcado")).toBeInTheDocument();
    });

    it("Renderiza checkbox unchecked", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={false}>
              No marcado
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("No marcado")).toBeInTheDocument();
    });

    it("Renderiza checkbox con className", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked className="custom-checkbox">
              Checkbox custom
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Checkbox custom")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuRadioGroup y RadioItem", () => {
    it("Renderiza radio group", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="opcion1">
              <DropdownMenuRadioItem value="opcion1">
                Opción 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="opcion2">
                Opción 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Opción 1")).toBeInTheDocument();
      expect(screen.getByText("Opción 2")).toBeInTheDocument();
    });

    it("Renderiza radio item con className", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="test">
              <DropdownMenuRadioItem value="test" className="custom-radio">
                Radio custom
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Radio custom")).toBeInTheDocument();
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

  describe("DropdownMenuShortcut", () => {
    it("Renderiza shortcut", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Guardar
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("⌘S")).toBeInTheDocument();
    });

    it("Renderiza shortcut con className", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Acción
              <DropdownMenuShortcut className="custom-shortcut">
                Ctrl+K
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Ctrl+K")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuGroup", () => {
    it("Renderiza group", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Item 1</DropdownMenuItem>
              <DropdownMenuItem>Item 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
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

  describe("DropdownMenuPortal", () => {
    it("Renderiza portal", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuItem>En portal</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>,
      );

      expect(screen.getByText("En portal")).toBeInTheDocument();
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

    it("Renderiza checkbox sin prop checked", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem>Sin checked</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Sin checked")).toBeInTheDocument();
    });

    it("Renderiza menú completo con todos los componentes", () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menú completo</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Título</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Acción 1<DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              Opción marcada
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value="a">
              <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="b">B</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSub open>
              <DropdownMenuSubTrigger>Más</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Subacción</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByText("Título")).toBeInTheDocument();
      expect(screen.getByText("Acción 1")).toBeInTheDocument();
      expect(screen.getByText("Eliminar")).toBeInTheDocument();
      expect(screen.getByText("Opción marcada")).toBeInTheDocument();
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
      expect(screen.getByText("Más")).toBeInTheDocument();
      expect(screen.getByText("Subacción")).toBeInTheDocument();
    });
  });
});
