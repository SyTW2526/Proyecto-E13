import { PrismaClient } from "@prisma/client";
import { createNotification } from "../controllers/notificationsController.js";

const prisma = new PrismaClient();

/**
 * Script de ejemplo para insertar notificaciones de prueba
 * Ejecutar con: tsx src/scripts/seedNotifications.ts
 */
async function seedNotifications() {
  try {
    const userEmails = [
      "alu0101349824@ull.edu.es",
    ];

    let totalNotifications = 0;

    for (const email of userEmails) {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log(`⚠️ Usuario no encontrado: ${email}`);
        continue;
      }

      console.log(`Creando notificaciones para: ${user.email}`);

      const notificationData = [
        {
          type: "SYSTEM" as const,
          title: "Bienvenido a TaskGrid",
          description: "Tu cuenta ha sido creada exitosamente",
          actorName: "Sistema",
        },
        {
          type: "SHARED" as const,
          title: "Nueva tarea compartida",
          description: "alu0101xxxxx1 te ha compartido una tarea",
          actorName: "alu0101xxxxx1",
        },
        {
          type: "SHARED" as const,
          title: "Nueva lista compartida",
          description: "alu0101xxxxx2 te ha compartido una lista",
          actorName: "alu0101xxxxx2",
        },
        {
          type: "EXPIRED" as const,
          title: "Tarea eliminada",
          description: "La tarea 'Ejemplo' fue eliminada por vencimiento",
          actorName: "Sistema",
        },
      ];

      for (const data of notificationData) {
        await createNotification(
          user.id,
          data.type,
          data.title,
          data.description,
          data.actorName,
        );
      }

      totalNotifications += notificationData.length;
      console.log(`  ✅ ${notificationData.length} notificaciones creadas`);
    }

    console.log(
      `\n✅ Total: ${totalNotifications} notificaciones de prueba creadas`,
    );
  } catch (error) {
    console.error("Error al crear notificaciones:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNotifications();
