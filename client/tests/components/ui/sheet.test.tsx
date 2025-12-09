import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { I18nTestProvider } from "../../testUtils/i18nTestProvider";

describe("Sheet", () => {
  it("Renderiza el Sheet correctamente", () => {
    const { container } = render(
      <I18nTestProvider>
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetTitle>Título</SheetTitle>
            <SheetDescription>Descripción</SheetDescription>
          </SheetContent>
        </Sheet>
      </I18nTestProvider>,
    );

    expect(
      container.querySelector('[data-slot="sheet-trigger"]'),
    ).toBeInTheDocument();
  });

  it("Abre el Sheet al hacer click en el trigger", async () => {
    const user = userEvent.setup();

    render(
      <I18nTestProvider>
        <Sheet>
          <SheetTrigger>Abrir Sheet</SheetTrigger>
          <SheetContent>
            <SheetTitle>Título del Sheet</SheetTitle>
            <SheetDescription>Descripción del contenido</SheetDescription>
          </SheetContent>
        </Sheet>
      </I18nTestProvider>,
    );

    const trigger = screen.getByText("Abrir Sheet");
    await user.click(trigger);

    expect(screen.getByText("Título del Sheet")).toBeInTheDocument();
  });

  it("Renderiza SheetHeader correctamente", async () => {
    const user = userEvent.setup();

    render(
      <I18nTestProvider>
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Título</SheetTitle>
              <SheetDescription>Descripción</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </I18nTestProvider>,
    );

    await user.click(screen.getByText("Abrir"));

    await waitFor(() => {
      const header = document.querySelector('[data-slot="sheet-header"]');
      expect(header).toBeInTheDocument();
    });
  });

  it("Renderiza SheetFooter correctamente", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetTitle>Título</SheetTitle>
          <SheetDescription>Descripción</SheetDescription>
          <SheetFooter>
            <button>Aceptar</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByText("Abrir"));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="sheet-footer"]'),
      ).toBeInTheDocument();
    });
  });

  it("Aplica clases personalizadas al SheetContent", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent className="custom-content">
          <SheetTitle>Título</SheetTitle>
          <SheetDescription>Descripción</SheetDescription>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByText("Abrir"));

    await waitFor(() => {
      const content = document.querySelector('[data-slot="sheet-content"]');
      expect(content).toHaveClass("custom-content");
    });
  });

  it("Renderiza con side='left'", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent side="left">
          <SheetTitle>Título</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByText("Abrir"));

    expect(screen.getByText("Título")).toBeInTheDocument();
  });

  it("Renderiza con side='top'", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent side="top">
          <SheetTitle>Título</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByText("Abrir"));

    expect(screen.getByText("Título")).toBeInTheDocument();
  });

  it("Renderiza con side='bottom'", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent side="bottom">
          <SheetTitle>Título</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByText("Abrir"));

    expect(screen.getByText("Título")).toBeInTheDocument();
  });

  it("Renderiza SheetDescription correctamente", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetTitle>Título</SheetTitle>
          <SheetDescription>Esta es la descripción</SheetDescription>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByText("Abrir"));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="sheet-description"]'),
      ).toBeInTheDocument();
      expect(screen.getByText("Esta es la descripción")).toBeInTheDocument();
    });
  });

  it("Renderiza el botón de cierre", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetTitle>Título</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByText("Abrir"));

    expect(screen.getByText("Cerrar")).toBeInTheDocument();
  });

  it("Renderiza SheetClose correctamente", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetTitle>Título</SheetTitle>
          <SheetDescription>Descripción</SheetDescription>
          <SheetClose>Cerrar personalizado</SheetClose>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByText("Abrir"));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="sheet-close"]'),
      ).toBeInTheDocument();
    });
  });

  it("Renderiza overlay cuando está abierto", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetTitle>Título</SheetTitle>
          <SheetDescription>Descripción</SheetDescription>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByText("Abrir"));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="sheet-overlay"]'),
      ).toBeInTheDocument();
    });
  });

  it("Aplica clases personalizadas al SheetHeader", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetHeader className="custom-header">
            <SheetTitle>Título</SheetTitle>
            <SheetDescription>Descripción</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByText("Abrir"));

    await waitFor(() => {
      const header = document.querySelector('[data-slot="sheet-header"]');
      expect(header).toHaveClass("custom-header");
    });
  });

  it("Aplica clases personalizadas al SheetFooter", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetTitle>Título</SheetTitle>
          <SheetDescription>Descripción</SheetDescription>
          <SheetFooter className="custom-footer">
            <button>Aceptar</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByText("Abrir"));

    await waitFor(() => {
      const footer = document.querySelector('[data-slot="sheet-footer"]');
      expect(footer).toHaveClass("custom-footer");
    });
  });

  // Edge Cases / Casos Borde
  describe("Edge Cases", () => {
    it("Cierra el Sheet al presionar ESC", async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetTitle>Título</SheetTitle>
            <SheetDescription>Descripción</SheetDescription>
          </SheetContent>
        </Sheet>,
      );

      await user.click(screen.getByText("Abrir"));
      expect(screen.getByText("Título")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Título")).not.toBeInTheDocument();
      });
    });

    it("Renderiza SheetContent sin SheetTitle (caso inválido pero manejado)", async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetDescription>Solo descripción</SheetDescription>
          </SheetContent>
        </Sheet>,
      );

      await user.click(screen.getByText("Abrir"));

      await waitFor(() => {
        expect(screen.getByText("Solo descripción")).toBeInTheDocument();
      });
    });

    it("Renderiza SheetContent sin SheetDescription", async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetTitle>Solo título</SheetTitle>
          </SheetContent>
        </Sheet>,
      );

      await user.click(screen.getByText("Abrir"));

      await waitFor(() => {
        expect(screen.getByText("Solo título")).toBeInTheDocument();
      });
    });

    it("Maneja Sheet controlado con open prop", async () => {
      const { rerender } = render(
        <Sheet open={false}>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetTitle>Título</SheetTitle>
          </SheetContent>
        </Sheet>,
      );

      expect(screen.queryByText("Título")).not.toBeInTheDocument();

      rerender(
        <Sheet open={true}>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetTitle>Título</SheetTitle>
          </SheetContent>
        </Sheet>,
      );

      await waitFor(() => {
        expect(screen.getByText("Título")).toBeInTheDocument();
      });
    });

    it("Renderiza SheetHeader sin children", async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetTitle>Título</SheetTitle>
            <SheetHeader></SheetHeader>
          </SheetContent>
        </Sheet>,
      );

      await user.click(screen.getByText("Abrir"));

      await waitFor(() => {
        expect(
          document.querySelector('[data-slot="sheet-header"]'),
        ).toBeInTheDocument();
      });
    });

    it("Renderiza SheetFooter sin children", async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetTitle>Título</SheetTitle>
            <SheetFooter></SheetFooter>
          </SheetContent>
        </Sheet>,
      );

      await user.click(screen.getByText("Abrir"));

      await waitFor(() => {
        expect(
          document.querySelector('[data-slot="sheet-footer"]'),
        ).toBeInTheDocument();
      });
    });

    it("Maneja side con valor inválido usando default", async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <SheetContent side={"invalid" as any}>
            <SheetTitle>Título</SheetTitle>
          </SheetContent>
        </Sheet>,
      );

      await user.click(screen.getByText("Abrir"));

      await waitFor(() => {
        expect(screen.getByText("Título")).toBeInTheDocument();
      });
    });

    it("Renderiza múltiples SheetClose en el mismo Sheet", async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetTitle>Título</SheetTitle>
            <SheetClose>Cerrar 1</SheetClose>
            <SheetClose>Cerrar 2</SheetClose>
            <SheetClose>Cerrar 3</SheetClose>
          </SheetContent>
        </Sheet>,
      );

      await user.click(screen.getByText("Abrir"));

      await waitFor(() => {
        const closeButtons = document.querySelectorAll(
          '[data-slot="sheet-close"]',
        );
        expect(closeButtons.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("Renderiza SheetContent con className undefined", async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent className={undefined}>
            <SheetTitle>Título</SheetTitle>
          </SheetContent>
        </Sheet>,
      );

      await user.click(screen.getByText("Abrir"));

      await waitFor(() => {
        expect(
          document.querySelector('[data-slot="sheet-content"]'),
        ).toBeInTheDocument();
      });
    });

    it("Maneja contenido complejo en SheetContent", async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetTitle>Título</SheetTitle>
            <div>
              <p>Párrafo 1</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
              <form>
                <input type="text" />
                <button>Submit</button>
              </form>
            </div>
          </SheetContent>
        </Sheet>,
      );

      await user.click(screen.getByText("Abrir"));

      await waitFor(() => {
        expect(screen.getByText("Párrafo 1")).toBeInTheDocument();
        expect(screen.getByText("Item 1")).toBeInTheDocument();
      });
    });

    it("Cierra el Sheet al hacer click en el overlay", async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Abrir</SheetTrigger>
          <SheetContent>
            <SheetTitle>Título</SheetTitle>
          </SheetContent>
        </Sheet>,
      );

      await user.click(screen.getByText("Abrir"));
      expect(screen.getByText("Título")).toBeInTheDocument();

      const overlay = document.querySelector('[data-slot="sheet-overlay"]');
      if (overlay) {
        await user.click(overlay);

        await waitFor(() => {
          expect(screen.queryByText("Título")).not.toBeInTheDocument();
        });
      }
    });

    it("Renderiza todos los lados (top, right, bottom, left) correctamente", async () => {
      const user = userEvent.setup();
      const sides: Array<"top" | "right" | "bottom" | "left"> = [
        "top",
        "right",
        "bottom",
        "left",
      ];

      for (const side of sides) {
        const { unmount } = render(
          <Sheet>
            <SheetTrigger>Abrir {side}</SheetTrigger>
            <SheetContent side={side}>
              <SheetTitle>Título {side}</SheetTitle>
            </SheetContent>
          </Sheet>,
        );

        await user.click(screen.getByText(`Abrir ${side}`));

        await waitFor(() => {
          expect(screen.getByText(`Título ${side}`)).toBeInTheDocument();
        });

        unmount();
      }
    });
  });
});
