/**
 * @file errorTranslations.ts
 * @description Sistema de traducción de errores del backend (inglés) al español.
 *
 * Este archivo contiene traducciones para todos los mensajes de error que
 * vienen del backend en inglés, permitiendo mostrarlos en español al usuario.
 */

/**
 * Diccionario de traducciones de mensajes de error exactos
 */
const ERROR_TRANSLATIONS: Record<string, string> = {
  // === Errores de Contraseña ===
  "Password must be at least 6 characters":
    "La contraseña debe tener al menos 6 caracteres",
  "Password must contain uppercase letter":
    "La contraseña debe contener al menos una letra mayúscula",
  "Password must contain lowercase letter":
    "La contraseña debe contener al menos una letra minúscula",
  "Password must contain a number":
    "La contraseña debe contener al menos un número",

  // === Errores de Campos Requeridos ===
  "Current password is required": "La contraseña actual es obligatoria",
  "ID Token is required": "El token de ID es obligatorio",

  // === Errores Generales ===
  "Validation failed": "Error de validación",
  "Invalid credentials": "Credenciales inválidas",
  "Invalid email.": "Email inválido",
  "Wrong password.": "Contraseña incorrecta",
  "User not found": "Usuario no encontrado",
  "Email already in use": "El email ya está en uso",
  "Cannot change password for OAuth (Google) users":
    "No se puede cambiar la contraseña para usuarios de OAuth (Google)",
  Unauthorized: "No autorizado",
  Forbidden: "Acceso prohibido",
  "Not found": "No encontrado",

  // === Errores de Tareas ===
  "Title is required": "El título es obligatorio",
  "Description is required": "La descripción es obligatoria",
  "Invalid status": "Estado inválido",
  "Invalid priority": "Prioridad inválida",

  // === Errores de Listas y Categorías ===
  "Name is required": "El nombre es obligatorio",
  "Color is required": "El color es obligatorio",

  // === Errores de Permisos ===
  "Invalid permission": "Permiso inválido",
  "Permission denied": "Permiso denegado",
  "You don't have permission to perform this action":
    "No tienes permiso para realizar esta acción",

  // === Errores de Red ===
  "Network Error": "Error de red",
  "Request timeout": "Tiempo de espera agotado",
  "Server Error": "Error del servidor",
  "Service Unavailable": "Servicio no disponible",
};

/**
 * Patrones regex para traducciones dinámicas de mensajes que contienen valores
 */
const ERROR_PATTERNS: Array<{
  pattern: RegExp;
  template: (matches: RegExpMatchArray) => string;
}> = [
  {
    // "String must contain at least X character(s)"
    pattern: /String must contain at least (\d+) character\(s\)/,
    template: (matches) => `Debe contener al menos ${matches[1]} caracteres`,
  },
  {
    // "Expected string, received X"
    pattern: /Expected string, received (\w+)/,
    template: (matches) => `Se esperaba texto, se recibió ${matches[1]}`,
  },
  {
    // "Invalid enum value. Expected 'X' | 'Y', received 'Z'"
    pattern: /Invalid enum value\. Expected (.+), received '(.+)'/,
    template: (matches) =>
      `Valor inválido. Se esperaba ${matches[1]}, se recibió '${matches[2]}'`,
  },
  {
    // "Must be at least X characters long"
    pattern: /Must be at least (\d+) characters long/,
    template: (matches) => `Debe tener al menos ${matches[1]} caracteres`,
  },
];

/**
 * Traduce un mensaje de error del inglés al español.
 *
 * @param message - Mensaje de error en inglés del backend
 * @returns Mensaje traducido al español
 *
 * @example
 * ```typescript
 * translateError("Password must contain uppercase letter")
 * => "La contraseña debe contener al menos una letra mayúscula"
 *
 * translateError("Invalid credentials")
 * => "Credenciales inválidas"
 * ```
 */
export function translateError(message: string): string {
  // 1. Buscar traducción exacta
  if (ERROR_TRANSLATIONS[message]) {
    return ERROR_TRANSLATIONS[message];
  }

  // 2. Buscar coincidencia con patrones
  for (const { pattern, template } of ERROR_PATTERNS) {
    const matches = message.match(pattern);
    if (matches) {
      return template(matches);
    }
  }

  // 3. Si no hay traducción, devolver el mensaje original
  return message;
}

/**
 * Traduce múltiples mensajes de error.
 *
 * @param messages - Array de mensajes en inglés
 * @returns Array de mensajes traducidos
 */
export function translateErrors(messages: string[]): string[] {
  return messages.map(translateError);
}

/**
 * Traduce un objeto de errores por campo.
 *
 * @param errors - Objeto con errores por campo
 * @returns Objeto con los mismos campos pero mensajes traducidos
 *
 * @example
 * ```typescript
 * translateFieldErrors({
 *   password: "Password must contain uppercase letter",
 *   email: "Invalid email"
 * })
 * => {
 *    password: "La contraseña debe contener al menos una letra mayúscula",
 *    email: "Email inválido"
 *  }
 * ```
 */
export function translateFieldErrors(
  errors: Record<string, string>,
): Record<string, string> {
  const translated: Record<string, string> = {};

  for (const [field, message] of Object.entries(errors)) {
    translated[field] = translateError(message);
  }

  return translated;
}

/**
 * Agrega una traducción personalizada al diccionario.
 * Útil para extender las traducciones sin modificar este archivo.
 *
 * @param english - Mensaje en inglés
 * @param spanish - Traducción en español
 *
 * @example
 * ```typescript
 * addTranslation("Custom error message", "Mensaje de error personalizado");
 * ```
 */
export function addTranslation(english: string, spanish: string): void {
  ERROR_TRANSLATIONS[english] = spanish;
}

/**
 * Obtiene todas las traducciones disponibles (útil para debugging)
 */
export function getAllTranslations(): Record<string, string> {
  return { ...ERROR_TRANSLATIONS };
}
