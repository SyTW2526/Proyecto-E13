import { Router, Request, Response } from "express";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

const router = Router();

/**
 * POST /api/chat
 * Endpoint para procesar mensajes del chat usando Google Gemini
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    // Configurar headers para streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Usar streamText del AI SDK con Google Gemini
    const result = streamText({
      model: google(process.env.GEMINI_MODEL || "gemini-1.5-flash"),
      messages,
      system: `Eres un asistente útil para TaskGrid, una aplicación de gestión de tareas colaborativa.
Tu objetivo es ayudar a los usuarios a entender cómo usar la aplicación.

Características principales de TaskGrid:
- Crear y organizar tareas con prioridades
- Compartir listas y tareas con equipos
- Configurar notificaciones y recordatorios
- Dashboard con estadísticas y gráficos
- Colaboración en tiempo real con Socket.IO

Responde de manera concisa y útil en el idioma del usuario.`,
    });

    // Stream de respuesta
    for await (const chunk of result.textStream) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
    return;
  } catch (error) {
    console.error("Error in chat endpoint:", error);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Error processing chat request",
        message: error instanceof Error ? error.message : "Unknown error",
      });
      return;
    } else {
      res.end();
      return;
    }
  }
});

export default router;
