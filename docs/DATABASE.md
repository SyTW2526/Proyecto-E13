# 🗄️ Base de Datos - TaskGrid

## Descripción General

TaskGrid utiliza **PostgreSQL** como base de datos relacional, gestionada a través de **Prisma ORM**. La base de datos está alojada en **Supabase** para aprovechar su infraestructura robusta y escalable.

---

## 🏗️ Esquema de Base de Datos

### Diagrama ER (Entity-Relationship)

```plaintext
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    User      │1       *│    List      │1       *│    Task      │
│──────────────│─────────│──────────────│─────────│──────────────│
│ id (PK)      │         │ id (PK)      │         │ id (PK)      │
│ email        │         │ title        │         │ title        │
│ password     │         │ userId (FK)  │         │ description  │
│ name         │         │ createdAt    │         │ priority     │
│ avatar       │         │ updatedAt    │         │ status       │
│ googleId     │         │              │         │ listId (FK)  │
│ points       │         │              │         │ userId (FK)  │
│ language     │         │              │         │ dueDate      │
│ createdAt    │         │              │         │ createdAt    │
│ updatedAt    │         │              │         │ updatedAt    │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                        │
       │                        │                        │
       │                        │                        │
       │1                      *│                       *│
       │         ┌──────────────┴──────────────┐         │
       │         │    ListPermission           │         │
       │         │─────────────────────────────│         │
       │         │ id (PK)                     │         │
       │         │ listId (FK)                 │         │
       │         │ userId (FK)                 │         │
       │         │ role (view/edit/admin)      │         │
       │         │ createdAt                   │         │
       │         └─────────────────────────────┘         │
       │                                                 │
       │1                                               *│
       │         ┌────────────────────────────┐         │
       └─────────│    Notification            │─────────┘
                 │────────────────────────────│
                 │ id (PK)                    │
                 │ userId (FK)                │
                 │ taskId (FK)                │
                 │ type                       │
                 │ message                    │
                 │ read                       │
                 │ createdAt                  │
                 └────────────────────────────┘
```

---

## 📋 Modelos de Datos

### Usuario (User)

Almacena la información de cada usuario de la plataforma:

**Campos principales:**

- Identificador único
- Email (usado para login)
- Contraseña (encriptada, no visible)
- Nombre completo
- Foto de perfil (opcional)
- ID de Google (para OAuth)
- Puntos de gamificación
- Idioma preferido (español/inglés)
- Fechas de creación y actualización

**Relaciones:**

- Tiene múltiples listas
- Tiene múltiples tareas
- Puede tener permisos en listas compartidas
- Recibe notificaciones

---

### Lista (List)

Organiza las tareas en grupos temáticos:

**Campos principales:**

- Identificador único
- Título de la lista
- Descripción (opcional)
- Color para identificación visual
- ID del propietario
- Fechas de creación y actualización

**Relaciones:**

- Pertenece a un usuario (propietario)
- Contiene múltiples tareas
- Puede tener permisos de compartición

---

### Tarea (Task)

Representa cada tarea individual:

**Campos principales:**

- Identificador único
- Título de la tarea
- Descripción detallada (opcional)
- Prioridad (Baja, Media, Alta, Urgente)
- Estado (Pendiente, En Progreso, Completada, Cancelada)
- ID de la lista a la que pertenece
- ID del usuario creador
- Fecha límite (opcional)
- Fecha de completado (si aplica)
- Fechas de creación y actualización

**Estados posibles:**

- **Pendiente:** Tarea aún no iniciada
- **En Progreso:** Tarea en desarrollo
- **Completada:** Tarea finalizada exitosamente
- **Cancelada:** Tarea descartada

**Niveles de prioridad:**

- **Baja:** Puede esperar
- **Media:** Importancia normal
- **Alta:** Requiere atención pronto
- **Urgente:** Requiere acción inmediata

---

### Permisos de Lista (ListPermission)

Controla quién puede acceder a cada lista compartida:

**Campos principales:**

- Identificador único
- ID de la lista
- ID del usuario con acceso
- Rol/Nivel de permiso
- Fecha de creación

**Roles disponibles:**

- **VIEW (Ver):** Solo puede ver tareas, no editar
- **EDIT (Editar):** Puede ver y modificar tareas
- **ADMIN (Administrador):** Control total, incluye compartir y eliminar

Cada usuario solo puede tener un rol por lista, garantizando claridad en los permisos.

---

### Notificación (Notification)

Sistema de alertas para mantener a los usuarios informados:

**Campos principales:**

- Identificador único
- ID del usuario destinatario
- ID de la tarea relacionada (opcional)
- Tipo de notificación
- Mensaje descriptivo
- Estado de lectura (leída/no leída)
- Fecha de creación

**Tipos de notificaciones:**

- **TASK_ASSIGNED:** Te asignaron una nueva tarea
- **TASK_COMPLETED:** Una tarea fue completada
- **TASK_COMMENT:** Nuevo comentario en una tarea
- **LIST_SHARED:** Alguien compartió una lista contigo
- **MENTION:** Te mencionaron en un comentario

Las notificaciones aparecen como "no leídas" hasta que el usuario las revisa.

---

## 🔧 Gestión de la Base de Datos

### Tecnología

Utilizamos PostgreSQL, una base de datos relacional robusta y confiable, junto con Prisma ORM que facilita la interacción con la base de datos de forma segura y eficiente.

### Operaciones Principales

La base de datos permite realizar operaciones como:

- **Crear usuarios y tareas** de forma segura
- **Buscar información** con sus relaciones (ej: usuario con sus listas y tareas)
- **Actualizar datos** de forma atómica y consistente
- **Realizar transacciones** que garantizan la integridad de los datos

Todo el acceso a la base de datos está protegido y validado.

---

## 🔄 Migraciones y Actualizaciones

La estructura de la base de datos se mantiene actualizada mediante un sistema de migraciones automático:

**Qué son las migraciones:**

- Cambios controlados en la estructura de la base de datos
- Se aplican automáticamente en cada actualización
- Preservan los datos existentes
- Garantizan consistencia entre entornos

**Proceso:**
Cuando el equipo de desarrollo realiza mejoras en la base de datos, las migraciones se encargan de:

1. Aplicar los cambios necesarios
2. Mantener la integridad de los datos
3. Sincronizar con el código de la aplicación

Todo este proceso es transparente para los usuarios.

---

## 🚀 Optimización y Rendimiento

### Índices de Base de Datos

La base de datos utiliza índices estratégicos para acelerar las búsquedas:

**Índices en Usuarios:**

- Búsqueda por email (login rápido)
- Búsqueda por ID de Google (OAuth)

**Índices en Tareas:**

- Por lista (ver todas las tareas de una lista)
- Por usuario (mis tareas)
- Por estado (tareas pendientes/completadas)
- Por prioridad (tareas urgentes)

**Índices en Notificaciones:**

- Por usuario y estado de lectura (notificaciones no leídas)

Estos índices hacen que la aplicación responda rápidamente incluso con miles de registros.

### Estrategias de Optimización

**Carga eficiente de datos:**

- Se obtienen solo los datos necesarios
- Las relaciones se cargan de forma inteligente
- Evita múltiples consultas innecesarias

**Paginación:**

- Las listas largas se dividen en páginas
- Carga progresiva según navegas
- Mejor rendimiento y experiencia de usuario

**Selección de campos:**

- Solo se transfieren los datos que verás
- Las contraseñas nunca se envían al navegador
- Reduce el tráfico de red

---

## 🔒 Seguridad de Datos

### Prevención de Ataques

**Protección contra inyección SQL:**

- El sistema utiliza queries parametrizadas
- Los datos de entrada nunca se concatenan directamente
- Validación automática de todos los valores

**Seguridad a nivel de filas:**

- Cada usuario solo ve sus propios datos
- Filtros automáticos por propietario
- Verificación de permisos en cada operación

**Eliminaciones seguras:**

- Las eliminaciones en cascada protegen la integridad
- Relaciones huérfanas se previenen automáticamente
- Soft deletes para datos críticos (se marcan como eliminados en vez de borrarse)

---

## 🌱 Datos de Prueba

Para facilitar el testing y desarrollo, el sistema puede generar datos de ejemplo:

**Usuarios de prueba:**

- Cuentas con diferentes configuraciones
- Perfiles con varios niveles de actividad

**Listas y tareas de ejemplo:**

- Diferentes estados y prioridades
- Relaciones de compartición
- Notificaciones de muestra

Estos datos solo existen en entornos de desarrollo y nunca en producción.

---

## 🧪 Testing de Base de Datos

El sistema de base de datos está completamente probado:

**Configuración de pruebas:**

- Base de datos de test separada
- Limpieza automática entre tests
- Datos aislados por cada prueba

**Tipos de tests:**

- Creación y lectura de registros
- Actualización de datos
- Relaciones entre modelos
- Integridad referencial
- Restricciones y validaciones

Todo el código de base de datos pasa por pruebas rigurosas antes de llegar a producción.

---

## 📚 Documentación Relacionada

Para más información sobre cómo interactúa la base de datos con otras partes del sistema:

- **API:** Consulta la documentación de endpoints
- **Autenticación:** Ver guía de seguridad y usuarios
- **Arquitectura:** Entender cómo se integra todo el sistema
