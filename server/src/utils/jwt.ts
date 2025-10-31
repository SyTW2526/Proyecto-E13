import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
