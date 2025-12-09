import { beforeEach, describe, expect, it, vi } from "vitest";

describe("JWT Production Environment Check (Line 10)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Limpiar el caché de módulos para poder reimportar
    vi.resetModules();
    // Restaurar env original
    process.env = { ...originalEnv };
  });

  it("should throw error when JWT_SECRET is dev-secret in production", async () => {
    // Configurar el entorno de producción con dev-secret
    process.env.NODE_ENV = "production";
    process.env.JWT_SECRET = "dev-secret";

    // Intentar importar el módulo debería lanzar un error
    await expect(async () => {
      await import("../src/utils/jwt");
    }).rejects.toThrow("JWT_SECRET must be set in production environment");
  });

  it("should not throw error when JWT_SECRET is set correctly in production", async () => {
    // Configurar el entorno de producción con un secreto válido
    process.env.NODE_ENV = "production";
    process.env.JWT_SECRET = "production-secret-key";

    // Importar el módulo no debería lanzar un error
    const module = await import("../src/utils/jwt");
    expect(module).toBeDefined();
    expect(module.generateToken).toBeDefined();
    expect(module.verifyToken).toBeDefined();
  });

  it("should not throw error when using dev-secret in non-production", async () => {
    // Configurar el entorno de desarrollo con dev-secret
    process.env.NODE_ENV = "development";
    process.env.JWT_SECRET = "dev-secret";

    // Importar el módulo no debería lanzar un error
    const module = await import("../src/utils/jwt");
    expect(module).toBeDefined();
    expect(module.generateToken).toBeDefined();
    expect(module.verifyToken).toBeDefined();
  });

  it("should not throw error when JWT_SECRET is undefined in production but fallback is used", async () => {
    // Configurar el entorno de producción sin JWT_SECRET
    process.env.NODE_ENV = "production";
    delete process.env.JWT_SECRET;

    // El módulo usará el fallback "dev-secret", lo que debería lanzar error
    await expect(async () => {
      await import("../src/utils/jwt");
    }).rejects.toThrow("JWT_SECRET must be set in production environment");
  });
});
