import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useAutosizeTextArea } from "../../../src/hooks/chatBot/useAutosizeTextarea";

describe("useAutosizeTextArea", () => {
  let textareaRef: React.RefObject<HTMLTextAreaElement>;
  let mockTextarea: HTMLTextAreaElement;

  beforeEach(() => {
    // Crear un textarea mock
    mockTextarea = document.createElement("textarea");
    Object.defineProperty(mockTextarea, "scrollHeight", {
      writable: true,
      value: 100,
    });
    mockTextarea.style.height = "50px";

    textareaRef = { current: mockTextarea };
  });

  it("debe ajustar la altura del textarea según el scrollHeight", () => {
    const { rerender } = renderHook(
      ({ dependencies }) =>
        useAutosizeTextArea({
          ref: textareaRef,
          dependencies,
        }),
      { initialProps: { dependencies: ["initial"] } },
    );

    expect(mockTextarea.style.height).toBe("100px");

    // Cambiar scrollHeight
    Object.defineProperty(mockTextarea, "scrollHeight", {
      writable: true,
      value: 150,
    });

    rerender({ dependencies: ["changed"] });
    expect(mockTextarea.style.height).toBe("150px");
  });

  it("debe respetar maxHeight", () => {
    // First set initial scrollHeight
    Object.defineProperty(mockTextarea, "scrollHeight", {
      writable: true,
      value: 100,
    });

    const { rerender } = renderHook(
      ({ deps }) =>
        useAutosizeTextArea({
          ref: textareaRef,
          maxHeight: 200,
          dependencies: deps,
        }),
      { initialProps: { deps: ["initial"] } },
    );

    // Now change scrollHeight to exceed maxHeight
    Object.defineProperty(mockTextarea, "scrollHeight", {
      writable: true,
      value: 300,
    });

    rerender({ deps: ["changed"] });

    // El hook debería limitar a maxHeight
    const height = parseInt(mockTextarea.style.height);
    expect(height).toBeLessThanOrEqual(200);
  });

  it("debe mantener altura mínima original", () => {
    Object.defineProperty(mockTextarea, "scrollHeight", {
      writable: true,
      value: 100,
    });

    const { rerender } = renderHook(
      ({ dependencies }) =>
        useAutosizeTextArea({
          ref: textareaRef,
          dependencies,
        }),
      { initialProps: { dependencies: ["initial"] } },
    );

    // Intentar reducir scrollHeight por debajo del original
    Object.defineProperty(mockTextarea, "scrollHeight", {
      writable: true,
      value: 50,
    });

    rerender({ dependencies: ["changed"] });

    // Debe mantener la altura original (100)
    expect(mockTextarea.style.height).toBe("100px");
  });

  it("debe aplicar borderWidth correctamente", () => {
    Object.defineProperty(mockTextarea, "scrollHeight", {
      writable: true,
      value: 100,
    });

    renderHook(() =>
      useAutosizeTextArea({
        ref: textareaRef,
        borderWidth: 5,
        dependencies: ["test"],
      }),
    );

    // El height final debería tener en cuenta el borderWidth
    const height = parseInt(mockTextarea.style.height);
    expect(height).toBeGreaterThan(90); // originalHeight: 100 - borderWidth*2: 10 = 90, luego +10
  });

  it("no debe hacer nada si ref.current es null", () => {
    const nullRef = { current: null as unknown as HTMLTextAreaElement };

    renderHook(() =>
      useAutosizeTextArea({
        ref: nullRef,
        dependencies: ["test"],
      }),
    );

    // No debería lanzar error
    expect(true).toBe(true);
  });

  it("debe reaccionar a cambios en dependencies", () => {
    Object.defineProperty(mockTextarea, "scrollHeight", {
      writable: true,
      value: 100,
    });

    const { rerender } = renderHook(
      ({ deps }) =>
        useAutosizeTextArea({
          ref: textareaRef,
          dependencies: deps,
        }),
      { initialProps: { deps: ["dep1"] } },
    );

    const initialHeight = mockTextarea.style.height;

    Object.defineProperty(mockTextarea, "scrollHeight", {
      writable: true,
      value: 150,
    });

    rerender({ deps: ["dep2"] });

    expect(mockTextarea.style.height).not.toBe(initialHeight);
    expect(mockTextarea.style.height).toBe("150px");
  });

  it("debe usar maxHeight por defecto como Number.MAX_SAFE_INTEGER", () => {
    Object.defineProperty(mockTextarea, "scrollHeight", {
      writable: true,
      value: 10000,
    });

    renderHook(() =>
      useAutosizeTextArea({
        ref: textareaRef,
        dependencies: ["test"],
      }),
    );

    // No debe limitar la altura si no se especifica maxHeight
    expect(mockTextarea.style.height).toBe("10000px");
  });
});
