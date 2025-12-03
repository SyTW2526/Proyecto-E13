import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect } from "vitest";

expect.extend(matchers);

// Suprimir warnings de consola innecesarios durante los tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const message = args[0]?.toString() || "";
    // Suprimir errores de conexión al servidor y warnings de Recharts
    if (
      message.includes("ECONNREFUSED") ||
      message.includes("Error al cargar notificaciones") ||
      message.includes("ancho(0) y alto(0) del gráfico") ||
      message.includes(
        "Una actualización de TestComponent dentro de una prueba no estaba incluida en el acto",
      )
    ) {
      return;
    }
    originalError(...args);
  };

  console.warn = (...args: unknown[]) => {
    const message = args[0]?.toString() || "";
    // Suprimir warnings de Recharts
    if (message.includes("ancho") && message.includes("alto")) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

afterEach(() => {
  cleanup();
});
