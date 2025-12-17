# 📡 API Documentation - TaskGrid

## Base URL

**Desarrollo:** `http://localhost:3000/api`

---

## 🔐 Autenticación

Todas las rutas protegidas requieren un token de autenticación JWT (JSON Web Token) en el header de la petición:

```http
Authorization: Bearer [YOUR_TOKEN]
```

> **Nota:** Los tokens se obtienen al realizar login exitoso y tienen una duración limitada por seguridad.

---

## 📋 Endpoints

### 🔑 Authentication (`/auth`)

#### **POST /auth/register**

Registrar un nuevo usuario.

**Request:**

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "Password123!",
  "name": "Juan Pérez"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-...",
      "email": "usuario@example.com",
      "name": "Juan Pérez",
      "avatar": null,
      "points": 0,
      "language": "es",
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "[JWT_TOKEN]"
  }
}
```

**Errores:**

- `400` - Datos inválidos (validación Zod)
- `409` - Email ya registrado

---

#### **POST /auth/login**

Iniciar sesión.

**Request:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      /* Información del usuario */
    },
    "token": "[JWT_TOKEN]"
  }
}
```

**Errores:**

- `401` - Credenciales inválidas
- `429` - Demasiados intentos (rate limit)

---

#### **POST /auth/google**

Autenticación con Google OAuth.

**Request:**

```http
POST /api/auth/google
Content-Type: application/json

{
  "code": "4/0AfJohXm..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-...",
      "email": "usuario@gmail.com",
      "name": "Juan Pérez",
      "avatar": "https://lh3.googleusercontent.com/...",
      "googleId": "1234567890",
      "points": 0,
      "language": "es"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores:**

- `400` - Código de OAuth inválido
- `500` - Error al comunicarse con Google

---

### 👤 Users (`/users`)

#### **GET /users/me**

Obtener información del usuario actual.

**Request:**

```http
GET /api/users/me
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-...",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "avatar": "https://...",
    "points": 150,
    "language": "es",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "stats": {
      "totalTasks": 45,
      "completedTasks": 30,
      "pendingTasks": 15
    }
  }
}
```

---

#### **PATCH /users/me**

Actualizar perfil del usuario.

**Request:**

```http
PATCH /api/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Juan Carlos Pérez",
  "language": "en",
  "avatar": "https://..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-...",
    "email": "usuario@example.com",
    "name": "Juan Carlos Pérez",
    "language": "en",
    "avatar": "https://...",
    "points": 150
  }
}
```

---

### 📝 Lists (`/lists`)

#### **GET /lists**

Obtener todas las listas del usuario (propias y compartidas).

**Request:**

```http
GET /api/lists
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-...",
      "title": "Tareas Personales",
      "description": "Mi lista de tareas diarias",
      "color": "#6366f1",
      "userId": "uuid-owner",
      "isOwner": true,
      "permission": "ADMIN",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-05T12:00:00.000Z",
      "taskCount": 10,
      "completedCount": 7
    },
    {
      "id": "uuid-...",
      "title": "Proyecto Trabajo",
      "description": "Lista compartida del equipo",
      "color": "#ef4444",
      "userId": "uuid-other",
      "isOwner": false,
      "permission": "EDIT",
      "sharedBy": {
        "id": "uuid-other",
        "name": "María González",
        "email": "maria@example.com"
      },
      "createdAt": "2025-01-02T00:00:00.000Z",
      "updatedAt": "2025-01-06T09:00:00.000Z",
      "taskCount": 15,
      "completedCount": 5
    }
  ]
}
```

---

#### **POST /lists**

Crear una nueva lista.

**Request:**

```http
POST /api/lists
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nueva Lista",
  "description": "Descripción opcional",
  "color": "#10b981"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-...",
    "title": "Nueva Lista",
    "description": "Descripción opcional",
    "color": "#10b981",
    "userId": "uuid-...",
    "createdAt": "2025-01-07T00:00:00.000Z",
    "updatedAt": "2025-01-07T00:00:00.000Z"
  }
}
```

---

#### **GET /lists/:id**

Obtener detalles de una lista específica.

**Request:**

```http
GET /api/lists/uuid-lista-123
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-lista-123",
    "title": "Tareas Personales",
    "description": "Mi lista de tareas diarias",
    "color": "#6366f1",
    "userId": "uuid-...",
    "isOwner": true,
    "permission": "ADMIN",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-05T12:00:00.000Z",
    "tasks": [
      {
        "id": "uuid-task-1",
        "title": "Comprar comida",
        "description": null,
        "priority": "MEDIUM",
        "status": "PENDING",
        "dueDate": "2025-01-10T00:00:00.000Z",
        "createdAt": "2025-01-07T00:00:00.000Z"
      }
    ],
    "permissions": [
      {
        "id": "uuid-perm-1",
        "role": "EDIT",
        "user": {
          "id": "uuid-user-2",
          "name": "María González",
          "email": "maria@example.com",
          "avatar": "https://..."
        }
      }
    ]
  }
}
```

---

#### **PATCH /lists/:id**

Actualizar una lista.

**Request:**

```http
PATCH /api/lists/uuid-lista-123
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tareas del Hogar",
  "color": "#f59e0b"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-lista-123",
    "title": "Tareas del Hogar",
    "description": "Mi lista de tareas diarias",
    "color": "#f59e0b",
    "updatedAt": "2025-01-07T12:00:00.000Z"
  }
}
```

---

#### **DELETE /lists/:id**

Eliminar una lista (solo propietarios).

**Request:**

```http
DELETE /api/lists/uuid-lista-123
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Lista eliminada correctamente"
}
```

**Errores:**

- `403` - No tienes permiso (no eres propietario)
- `404` - Lista no encontrada

---

### ✅ Tasks (`/tasks`)

#### **GET /tasks**

Obtener todas las tareas del usuario con filtros opcionales.

**Query Parameters:**

- `listId`: Filtrar por lista
- `status`: Filtrar por estado (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `priority`: Filtrar por prioridad (LOW, MEDIUM, HIGH, URGENT)
- `search`: Buscar en título y descripción
- `dueDate`: Filtrar por fecha límite
- `page`: Página (default: 1)
- `limit`: Tareas por página (default: 20, max: 100)

**Request:**

```http
GET /api/tasks?status=PENDING&priority=HIGH&page=1&limit=20
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid-task-1",
        "title": "Terminar informe",
        "description": "Informe mensual de ventas",
        "priority": "HIGH",
        "status": "PENDING",
        "listId": "uuid-lista-1",
        "list": {
          "id": "uuid-lista-1",
          "title": "Trabajo",
          "color": "#ef4444"
        },
        "dueDate": "2025-01-10T00:00:00.000Z",
        "completedAt": null,
        "createdAt": "2025-01-07T00:00:00.000Z",
        "updatedAt": "2025-01-07T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

---

#### **POST /tasks**

Crear una nueva tarea.

**Request:**

```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nueva tarea",
  "description": "Descripción detallada",
  "priority": "MEDIUM",
  "status": "PENDING",
  "listId": "uuid-lista-123",
  "dueDate": "2025-01-15T00:00:00.000Z"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-task-new",
    "title": "Nueva tarea",
    "description": "Descripción detallada",
    "priority": "MEDIUM",
    "status": "PENDING",
    "listId": "uuid-lista-123",
    "userId": "uuid-user",
    "dueDate": "2025-01-15T00:00:00.000Z",
    "completedAt": null,
    "createdAt": "2025-01-08T00:00:00.000Z",
    "updatedAt": "2025-01-08T00:00:00.000Z",
    "pointsAwarded": 10
  }
}
```

---

#### **PATCH /tasks/:id**

Actualizar una tarea.

**Request:**

```http
PATCH /api/tasks/uuid-task-123
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "COMPLETED",
  "completedAt": "2025-01-08T14:30:00.000Z"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-task-123",
    "title": "Terminar informe",
    "status": "COMPLETED",
    "completedAt": "2025-01-08T14:30:00.000Z",
    "updatedAt": "2025-01-08T14:30:00.000Z",
    "pointsAwarded": 15
  }
}
```

---

#### **DELETE /tasks/:id**

Eliminar una tarea.

**Request:**

```http
DELETE /api/tasks/uuid-task-123
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Tarea eliminada correctamente"
}
```

---

### 🔔 Notifications (`/notifications`)

#### **GET /notifications**

Obtener notificaciones del usuario.

**Query Parameters:**

- `read`: Filtrar por leídas/no leídas (true/false)
- `type`: Filtrar por tipo
- `limit`: Límite de resultados (default: 50)

**Request:**

```http
GET /api/notifications?read=false&limit=20
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-notif-1",
      "type": "TASK_ASSIGNED",
      "message": "Te han asignado la tarea: Revisar código",
      "read": false,
      "taskId": "uuid-task-123",
      "task": {
        "id": "uuid-task-123",
        "title": "Revisar código",
        "listId": "uuid-lista-1"
      },
      "createdAt": "2025-01-08T10:00:00.000Z"
    },
    {
      "id": "uuid-notif-2",
      "type": "LIST_SHARED",
      "message": "María González compartió 'Proyecto Trabajo' contigo",
      "read": false,
      "taskId": null,
      "createdAt": "2025-01-08T09:00:00.000Z"
    }
  ],
  "unreadCount": 5
}
```

---

#### **PATCH /notifications/:id/read**

Marcar notificación como leída.

**Request:**

```http
PATCH /api/notifications/uuid-notif-1/read
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-notif-1",
    "read": true,
    "updatedAt": "2025-01-08T15:00:00.000Z"
  }
}
```

---

#### **POST /notifications/read-all**

Marcar todas las notificaciones como leídas.

**Request:**

```http
POST /api/notifications/read-all
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Todas las notificaciones marcadas como leídas",
  "count": 12
}
```

---

### 🤝 Permissions (`/permissions`)

#### **POST /lists/:listId/permissions**

Compartir lista con otro usuario.

**Request:**

```http
POST /api/lists/uuid-lista-123/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "userEmail": "maria@example.com",
  "role": "EDIT"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-perm-new",
    "listId": "uuid-lista-123",
    "userId": "uuid-user-maria",
    "role": "EDIT",
    "user": {
      "id": "uuid-user-maria",
      "name": "María González",
      "email": "maria@example.com",
      "avatar": "https://..."
    },
    "createdAt": "2025-01-08T16:00:00.000Z"
  },
  "notification": {
    "sent": true,
    "message": "Notificación enviada a maria@example.com"
  }
}
```

**Errores:**

- `403` - No tienes permiso (no eres ADMIN)
- `404` - Usuario no encontrado
- `409` - Usuario ya tiene acceso a esta lista

---

#### **PATCH /permissions/:id**

Actualizar rol de un permiso.

**Request:**

```http
PATCH /api/permissions/uuid-perm-123
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "ADMIN"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-perm-123",
    "role": "ADMIN",
    "updatedAt": "2025-01-08T17:00:00.000Z"
  }
}
```

---

#### **DELETE /permissions/:id**

Revocar acceso a una lista.

**Request:**

```http
DELETE /api/permissions/uuid-perm-123
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Permiso revocado correctamente"
}
```

---

### 📊 Dashboard (`/dashboard`)

#### **GET /dashboard/stats**

Obtener estadísticas del dashboard.

**Request:**

```http
GET /api/dashboard/stats
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "tasks": {
      "total": 45,
      "pending": 15,
      "inProgress": 10,
      "completed": 20,
      "cancelled": 0
    },
    "priorities": {
      "low": 10,
      "medium": 20,
      "high": 12,
      "urgent": 3
    },
    "weeklyActivity": [
      { "day": "Lun", "pending": 5, "inProgress": 3, "completed": 2 },
      { "day": "Mar", "pending": 4, "inProgress": 2, "completed": 3 },
      { "day": "Mie", "pending": 6, "inProgress": 1, "completed": 4 }
    ],
    "user": {
      "points": 250,
      "rank": "Experto",
      "tasksCompletedThisWeek": 15
    }
  }
}
```

---

## 🚨 Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos de entrada inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      }
    ]
  }
}
```

### Códigos de Error Comunes

| Código           | Status | Descripción                        |
| ---------------- | ------ | ---------------------------------- |
| UNAUTHORIZED     | 401    | Token no proporcionado o inválido  |
| FORBIDDEN        | 403    | No tienes permiso para esta acción |
| NOT_FOUND        | 404    | Recurso no encontrado              |
| VALIDATION_ERROR | 400    | Datos de entrada inválidos         |
| CONFLICT         | 409    | Conflicto (ej: email duplicado)    |
| RATE_LIMIT       | 429    | Demasiadas peticiones              |
| INTERNAL_ERROR   | 500    | Error interno del servidor         |

---

## 📚 Referencias

- [OpenAPI Specification](../api/openapi.yaml)
- [Postman Collection](../api/TaskGrid.postman_collection.json)
- [Authentication Guide](./AUTHENTICATION.md)
- [Database Schema](./DATABASE.md)
