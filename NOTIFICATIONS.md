# Sistema de Notificaciones - TaskGrid

## 📋 Resumen

Se ha implementado un sistema completo de notificaciones en tiempo real que conecta el frontend con el backend mediante una API RESTful.

## 🏗️ Arquitectura

### Backend (Server)

#### 1. **Modelo de Base de Datos** (`prisma/schema.prisma`)

```prisma
model Notification {
  id          String            @id @default(uuid())
  type        NotificationType
  title       String
  description String
  actorName   String
  read        Boolean           @default(false)
  createdAt   DateTime          @default(now())
  userId      String
  user        User              @relation(...)
}

enum NotificationType {
  GENERAL
  MENTION
  INBOX
  FILE
}
```

#### 2. **Controlador** (`src/controllers/notificationsController.ts`)

- `getNotifications()` - Obtener todas las notificaciones del usuario
- `markNotificationAsRead()` - Marcar una notificación como leída
- `markAllNotificationsAsRead()` - Marcar todas como leídas
- `getUnreadCount()` - Obtener contador de no leídas
- `createNotification()` - Crear nueva notificación (función auxiliar)

#### 3. **Rutas** (`src/routes/notificationsRoutes.ts`)

- `GET /api/notifications` - Lista de notificaciones
- `GET /api/notifications/unread-count` - Contador de no leídas
- `PATCH /api/notifications/:id/read` - Marcar una como leída
- `PATCH /api/notifications/read-all` - Marcar todas como leídas

### Frontend (Client)

#### 1. **Tipos** (`src/types/notification/notification.ts`)

```typescript
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  actorName: string;
  read: boolean;
  createdAt: string;
  userId: string;
}
```

#### 2. **API Client** (`src/lib/api.ts`)

- `fetchNotifications()` - Obtener notificaciones
- `fetchUnreadCount()` - Obtener contador
- `markNotificationAsRead(id)` - Marcar como leída
- `markAllNotificationsAsRead()` - Marcar todas como leídas

#### 3. **Hook Personalizado** (`src/hooks/useNotifications.ts`)

```typescript
const {
  notifications,
  loading,
  error,
  unreadCount,
  loadNotifications,
  markAsRead,
  markAllAsRead,
  getNotificationsByType,
} = useNotifications();
```

#### 4. **Componente UI** (`src/components/notifications/NotificationBell.tsx`)

- Botón de campana con badge de contador
- Popover con pestañas por tipo de notificación
- Lista de notificaciones con formato de tiempo relativo
- Acciones para marcar como leídas

## 🚀 Uso

### Generar cliente Prisma

```bash
npx prisma generate
```

### Ejecutar migración de base de datos

```bash
cd server
npx prisma migrate dev --name add_notifications
```

Si la base de datos no está accesible, la migración se creará cuando esté disponible.

### Insertar notificaciones de prueba

```bash
cd server
npx tsx src/scripts/seedNotifications.ts
```

### Crear notificaciones desde otros controladores

```typescript
import { createNotification } from "../controllers/notificationsController.js";

// Ejemplo: Notificar cuando se comparte una tarea
await createNotification(
  userId,
  "INBOX",
  "Tarea compartida",
  `${actorName} compartió una tarea contigo`,
  actorName
);
```

## 📊 Tipos de Notificaciones

| Tipo      | Descripción                          | Uso recomendado                     |
| --------- | ------------------------------------ | ----------------------------------- |
| `GENERAL` | Notificaciones generales del sistema | Avisos generales, bienvenida        |
| `MENTION` | Menciones en comentarios             | Cuando alguien menciona al usuario  |
| `INBOX`   | Solicitudes y bandeja de entrada     | Solicitudes de acceso, invitaciones |
| `FILE`    | Relacionadas con archivos            | Compartir archivos, actualizaciones |

## 🔄 Flujo de Datos

1. **Carga inicial**: El componente `NotificationBell` usa `useNotifications` que automáticamente carga las notificaciones al montarse
2. **Actualización en tiempo real**: Al hacer click en una notificación se marca como leída y se actualiza el estado local
3. **Sincronización**: Las acciones se reflejan inmediatamente en la UI mientras se sincronizan con el backend

## 🎨 Características UI

- **Badge de contador**: Muestra el número de notificaciones no leídas
- **Pestañas filtradas**: Permite filtrar por tipo de notificación
- **Tiempo relativo**: Muestra "Hace 2 horas" en lugar de fechas absolutas
- **Estados visuales**: Las notificaciones no leídas tienen un fondo destacado
- **Responsive**: Adaptado para dispositivos móviles y escritorio

## 🔧 Próximas mejoras sugeridas

1. **WebSockets**: Para actualizaciones en tiempo real más eficientes que polling
2. **Paginación**: Para manejar grandes cantidades de notificaciones
3. **Notificaciones por email**: Integrar servicio SMTP para enviar emails cuando `emailNotifications` esté activado
4. **Personalización**: Permitir al usuario configurar qué tipos de notificaciones recibir
5. **Acciones directas**: Botones de acción en las notificaciones (Aceptar, Rechazar, etc.)
6. **Historial de notificaciones**: Archivo de notificaciones antiguas

## ⚙️ Configuración de Preferencias

### Notificaciones Push

Las notificaciones push funcionan mediante **polling** cada 30 segundos. Cuando el usuario tiene `pushNotifications` activado en Settings:

- El hook `useNotifications` consulta automáticamente nuevas notificaciones cada 30 segundos
- Se muestra un badge con el contador de notificaciones no leídas
- El componente se actualiza automáticamente cuando hay nuevas notificaciones

### Notificaciones por Email

La configuración `emailNotifications` está preparada en la base de datos y el frontend, pero **requiere implementación del servicio de email** (nodemailer, SendGrid, etc.) para funcionar completamente.

Para implementar emails:

1. Configurar servicio SMTP en el servidor
2. Modificar `createNotification()` para enviar emails si el usuario tiene `emailNotifications = true`
3. Crear plantillas HTML para los emails

## 📝 Notas

- Las notificaciones se eliminan automáticamente si se elimina el usuario (cascada)
- Las fechas se almacenan en UTC y se formatean en el cliente
- El sistema es completamente TypeScript con tipos estrictos
- Todos los endpoints requieren autenticación mediante JWT
