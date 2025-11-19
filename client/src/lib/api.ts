/**
 * @file api.ts
 * @description Cliente HTTP configurado para comunicarse con el backend.
 * Incluye manejo de tokens de autenticación y normalización de errores.
 */
import axios, { AxiosError } from "axios";
import { translateError } from "./errorTranslations";

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

/** Detalle de un error de validación de campo. */
export interface ValidationDetail {
  field: string;
  message: string;
}

/** Error normalizado para la app, sin `any`. */
export type AppError =
  | { kind: "network"; message: string }
  | { kind: "api"; status: number; message: string; data?: unknown }
  | {
      kind: "validation";
      status: number;
      message: string;
      details: ValidationDetail[];
    }
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

      // Detectar errores de validación de Zod
      if (
        Array.isArray(rec.details) &&
        rec.details.length > 0 &&
        typeof rec.details[0] === "object" &&
        rec.details[0] !== null
      ) {
        const details = rec.details as ValidationDetail[];
        const errorMsg =
          typeof rec.error === "string" ? rec.error : "Validation failed";

        // Traducir mensajes de error a español
        const translatedDetails = details.map((detail) => ({
          field: detail.field,
          message: translateError(detail.message),
        }));

        return {
          kind: "validation",
          status,
          message: translateError(errorMsg),
          details: translatedDetails,
        };
      }

      if (typeof rec.error === "string") {
        serverMsg = rec.error;
      } else if (typeof rec.message === "string") {
        serverMsg = rec.message;
      }
    }

    return { kind: "api", status, message: translateError(serverMsg), data };
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

/** Obtiene el mensaje de error para un campo específico desde errores de validación. */
export function getFieldError(err: unknown, fieldName: string): string | null {
  const appError = toAppError(err);
  if (appError.kind === "validation") {
    const detail = appError.details.find((d) => d.field === fieldName);
    return detail?.message ?? null;
  }
  return null;
}

/** Obtiene todos los errores de validación agrupados por campo. */
export function getValidationErrors(
  err: unknown,
): Record<string, string> | null {
  const appError = toAppError(err);
  if (appError.kind === "validation") {
    return appError.details.reduce(
      (acc, detail) => {
        acc[detail.field] = detail.message;
        return acc;
      },
      {} as Record<string, string>,
    );
  }
  return null;
}
