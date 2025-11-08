export interface JwtPayload {
  userId: string;
  email: string;
  name?: string;
  exp?: number;  // Tiempo de expiración
  iat?: number;  // Tiempo de emisión
}