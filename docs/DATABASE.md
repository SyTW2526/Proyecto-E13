# 🗄️ Base de Datos - TaskGrid

## Descripción General

TaskGrid utiliza **PostgreSQL** como base de datos relacional, gestionada a través de **Prisma ORM**. La base de datos está alojada en **Neon** para aprovechar su infraestructura robusta y escalable.

---

## 📋 Modelos de Datos Más Importantes

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

### Lista/tarea Compartida (ListShare)

Controla quién puede acceder a cada lista compartida:

**Campos principales:**

- Identificador único
- ID de la lista/tarea
- ID del usuario con acceso
- Rol/Nivel de permiso
- Fecha de creación

**Roles disponibles:**

- **VIEW (Ver):**
- **EDIT (Editar):**
- **ADMIN (Administrador):**

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

- **SHARED:** Alguien compartió una lista contigo
- **SYSTEM:** Notificación del sistema
- **EXPIRED:** Expiró una tarea

---

## 🔧 Gestión de la Base de Datos

### Tecnología

Utilizamos PostgreSQL, una base de datos relacional robusta y confiable, junto con Prisma ORM que facilita la interacción con la base de datos de forma segura y eficiente.

### Operaciones Principales

La base de datos permite realizar operaciones como:

- **Crear usuarios, tareas y listas** de forma segura
- **Buscar información** con sus relaciones (ej: usuario con sus listas y tareas)
- **Actualizar datos** de forma atómica y consistente

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