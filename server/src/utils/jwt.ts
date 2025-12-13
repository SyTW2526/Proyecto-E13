import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";
const JWT_ISSUER = "taskgrid-api";
const JWT_ALGORITHM = "HS256";

if (!JWT_SECRET) {
  console.warn(
    "⚠️  JWT_SECRET not set. Using insecure default. Set JWT_SECRET in .env for security.",
  );
}

const SECRET = JWT_SECRET || "dev-secret-fallback";

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
    issuer: JWT_ISSUER,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, SECRET, {
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
    }) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw error;
  }
};
