import { Response } from "express";

export const handleServerError = (
  res: Response,
  error: unknown,
  message = "Error del servidor",
) => {
  console.error(message, error);
  return res.status(500).json({
    error: message,
    details: error instanceof Error ? error.message : "Unknown error",
  });
};

export const sanitizeUser = (user: Record<string, unknown>) => {
  // Excluir la contraseña antes de enviar al cliente
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safe } = user as any;
  return safe;
};
