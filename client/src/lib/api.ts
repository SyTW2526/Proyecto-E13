// client/src/lib/api.ts
/**
 * @file api.ts
 * @description Cliente HTTP configurado para comunicarse con el backend.
 * Incluye manejo de tokens de autenticación y normalización de errores.
 */
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 8000,
});

export function setAuthToken(token?: string) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
  }
}

const existing = localStorage.getItem("token");
if (existing) setAuthToken(existing);

/** Error normalizado para la app, sin `any`. */
export type AppError =
  | { kind: "network"; message: string }
  | { kind: "api"; status: number; message: string; data?: unknown }
  | { kind: "unknown"; message: string };

/** Convierte cualquier error en un `AppError` tipado. */
export function toAppError(err: unknown): AppError {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError;

    // Sin respuesta => caída del server o sin Internet
    if (!ax.response) {
      return { kind: "network", message: "Sin conexión con el servidor." };
    }

    const { status, data } = ax.response;

    // Intenta extraer `error` estándar del backend
    let serverMsg = ax.message;
    if (typeof data === "object" && data !== null) {
      const rec = data as Record<string, unknown>;
      if (typeof rec.error === "string") {
        serverMsg = rec.error;
      } else if (typeof rec.message === "string") {
        serverMsg = rec.message;
      }
    }

    return { kind: "api", status, message: serverMsg, data };
  }

  return {
    kind: "unknown",
    message: err instanceof Error ? err.message : "Error desconocido",
  };
}

/** Mensaje legible desde un `unknown`. */
export function apiErrorMessage(err: unknown): string {
  return toAppError(err).message;
}
