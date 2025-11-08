import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt";

const JWT_SECRET = process.env.JWT_SECRET;

// Verifica que JWT_SECRET esté configurado
if (!JWT_SECRET) {
  console.error(
    "⚠️  ADVERTENCIA: JWT_SECRET no está configurado en las variables de entorno",
  );
  console.error("   Se usará un valor por defecto (NO SEGURO PARA PRODUCCIÓN)");
}

const jwtConfig = {
  secret: JWT_SECRET || "dev_secret_e13_sytw_please_change_in_prod",
  expiresIn: "7d" as string | number,
  algorithm: "HS256" as const,
  issuer: "taskgrid-api",
};

/**
 * Genera un token JWT para un usuario
 * @param payload Datos del usuario a incluir en el token
 * @returns Token JWT firmado
 */
export const generateToken = (
  payload: Omit<JwtPayload, "exp" | "iat">,
): string => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: "7d",
    algorithm: "HS256",
    issuer: jwtConfig.issuer,
  } as jwt.SignOptions);
};

/**
 * Verifica un token JWT
 * @param token Token JWT a verificar
 * @returns Payload decodificado si el token es válido
 * @throws Error si el token es inválido o ha expirado
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, jwtConfig.secret, {
      algorithms: [jwtConfig.algorithm],
      issuer: jwtConfig.issuer,
    }) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("El token ha expirado");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Token inválido");
    }
    throw error;
  }
};
