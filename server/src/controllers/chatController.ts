import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { Request, Response } from "express";

export const chatController = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const result = streamText({
      model: google(process.env.GEMINI_MODEL || "gemini-1.5-flash"),
      messages,
      system: `Eres un asistente útil para TaskGrid, una aplicación de gestión de tareas colaborativa.
Tu objetivo es ayudar a los usuarios a entender cómo usar la aplicación.

Características principales de TaskGrid:
- Crear listas: para crear una lista se debe ir a la página de Tareas y en la parte derecha de la pantalla hacer click en la card "Nueva Lista" Se debe introducir el nombre y opcionalmente una descripción, por último hacer click en el botón "Crear Lista".
- Editar listas: para editar una lista se debe ir a la página de Tareas, hacer click en los 3 puntos de la lista que se desea editar y hacer click en el botón "Editar". Se editan los datos deseados.
- Eliminar listas: para eliminar una lista se debe ir a la página de Tareas, hacer click en los 3 puntos de la lista que se desea eliminar y hacer click en el botón "Eliminar".
- Crear tareas: para crear una tarea se debe ir a la página de Tareas o Compartido si se desea crear una tarea sobre una lista que nos compartieron y hacer click en la card "Nueva Tarea". Se debe introducir el nombre, elegir la lista a la que pertenece, el estado, la prioridad y opcionalmente una descripción y la fecha de vencimiento, por último hacer click en el botón "Crear Tarea".
- Editar tareas: para editar una tarea se debe ir a la página de Tareas o Compartido si se desea editar una tarea que nos compartieron, hacer click en los 3 puntos de la tarea que se desea editar y hacer click en el botón "Editar". Se editan los datos deseados.
- Eliminar tareas: para eliminar una tarea se debe ir a la página de Tareas o Compartido si se desea eliminar una tarea que nos compartieron, hacer click en los 3 puntos de la tarea que se desea eliminar y hacer click en el botón "Eliminar".
- Compartir listas: para compartir una lista se debe ir a la página de Tareas, hacer click en los 3 puntos de la lista que se desea compartir y hacer click en el botón "Compartir". Se debe introducir el correo electrónico del usuario con el que se desea compartir la lista y elegir el permiso entre EDITAR, VER Y ADMIN.
- Compartir tareas: para compartir una tarea se debe ir a la página de Tareas o Compartido si se desea compartir una tarea que nos compartieron, hacer click en los 3 puntos de la tarea que se desea compartir y hacer click en el botón "Compartir". Se debe introducir el correo electrónico del usuario con el que se desea compartir la tarea y elegir el permiso entre EDITAR, VER Y ADMIN.
- En la página de ajustes se puede cambiar el nombre, la contraseña si no es una cuenta de google, activar o desactivar las notificaciones de email y dentro de la app(push) mediante un switch, personalizar la interfaz de usuario y eliminar la cuenta.

Responde de manera concisa y visiblemnte ordenada, haciendo uso, por ejemplo de guiones.`,
    });

    for await (const chunk of result.textStream) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    return res.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Error processing chat request",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
    res.end();
    return;
  }
};
