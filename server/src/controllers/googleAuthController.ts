// server/src/controllers/googleAuthController.ts
import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

// Validación de configuración
if (!GOOGLE_CLIENT_ID) {
  console.error(
    "GOOGLE_CLIENT_ID no está configurado en las variables de entorno",
  );
}

if (JWT_SECRET === "dev-secret") {
  console.warn(
    "JWT_SECRET no está configurado, usando valor por defecto (inseguro)",
  );
}

const oauth = new OAuth2Client(GOOGLE_CLIENT_ID);

function signAppToken(user: { id: string; email: string; name?: string }) {
  return generateToken({
    userId: user.id,
    email: user.email,
    name: user.name
  });
}

/**
 * POST /api/auth/google
 * body: { idToken: string }
 */
export async function googleSignIn(req: Request, res: Response) {
  // Verificar configuración
  if (!GOOGLE_CLIENT_ID) {
    console.error("GOOGLE_CLIENT_ID no configurado");
    return res
      .status(500)
      .json({ error: "Configuración de Google incompleta" });
  }

  const { idToken } = (req.body ?? {}) as { idToken?: string };

  if (!idToken) {
    console.error("Solicitud sin idToken");
    return res.status(400).json({ error: "Falta idToken" });
  }

  try {
    console.log("Verificando token de Google...");
    console.log("GOOGLE_CLIENT_ID configurado:", GOOGLE_CLIENT_ID);
    console.log(
      "Token recibido (primeros 50 caracteres):",
      idToken.substring(0, 50),
    );

    // 1) Verificar el ID Token contra Google
    const ticket = await oauth
      .verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      })
      .catch((error) => {
        console.error("Error detallado al verificar el token:", error.message);
        throw error;
      });

    const payload = ticket.getPayload();
    console.log("Token verificado, procesando payload...");

    const email = payload?.email ?? null;
    const emailVerified = Boolean(payload?.email_verified);
    const googleSub = payload?.sub ?? null;
    const name =
      payload?.name ?? (email ? email.split("@")[0] : "Usuario Google");

    if (!email || !emailVerified || !googleSub) {
      console.error("Payload de Google inválido:", {
        email,
        emailVerified,
        googleSub,
      });
      return res
        .status(400)
        .json({ error: "Credenciales de Google inválidas" });
    }

    console.log("Datos del usuario de Google validados:", {
      email,
      name,
      googleSub,
    });

    // 2) Buscar/crear usuario en tu BD
    //    a) si ya está enlazado por googleSub
    let user = await prisma.user.findFirst({
      where: { googleSub },
    });

    //    b) si no, intentar por email y enlazar googleSub
    if (!user) {
      const byEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (byEmail) {
        user = await prisma.user.update({
          where: { id: byEmail.id },
          data: { googleSub },
        });
      } else {
        //    c) crear usuario nuevo (password vacío para cuentas Google)
        user = await prisma.user.create({
          data: {
            email,
            name,
            password: "", // el login por Google no usa password local
            googleSub,
          },
        });
      }
    }

    // 3) Emitir tu JWT de aplicación
    const token = signAppToken({ id: user.id, email: user.email });
    return res.json({ token });
  } catch (e) {
    console.error("Error completo:", e);
    const errorMessage = e instanceof Error ? e.message : "Error desconocido";
    return res.status(401).json({
      error: "Invalid Google credential",
      details: errorMessage,
    });
  }
}
