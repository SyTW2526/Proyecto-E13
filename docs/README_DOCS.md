# 📚 Documentación Completa de TaskGrid

## Índice de Documentación

Esta carpeta contiene documentación técnica exhaustiva del proyecto TaskGrid. Cada archivo cubre un aspecto específico de la arquitectura y funcionalidad de la aplicación.

---

## 📄 Archivos de Documentación

### 1. [ARCHITECTURE.md](./ARCHITECTURE.md) 🏗️

**Arquitectura General del Proyecto**

Contenido:

- Diagrama de arquitectura completo (Cliente-Servidor-Base de Datos)
- Estructura de carpetas detallada
- Tecnologías utilizadas en cada capa
- Flujo de datos y comunicación entre componentes
- Patrones de diseño implementados
- Estrategias de escalabilidad
- Consideraciones de seguridad
- Monitoreo y logging

**¿Cuándo leer este documento?**

- Para entender la estructura general del proyecto
- Al incorporarte al equipo de desarrollo
- Para planificar nuevas features
- Al evaluar cambios arquitectónicos

---

### 2. [AUTHENTICATION.md](./AUTHENTICATION.md) 🔐

**Sistema de Autenticación y Seguridad**

Contenido:

- Autenticación tradicional (email/password)
- Google OAuth 2.0 integrado
- Generación y verificación de JWT
- Hashing de contraseñas con bcrypt
- Rate limiting y protección contra ataques
- Integración con Redux en el frontend
- Protected routes
- Axios interceptors para tokens
- Testing de autenticación

**¿Cuándo leer este documento?**

- Para implementar nuevos métodos de autenticación
- Al debuggear problemas de login/logout
- Para entender el flujo de sesiones de usuario
- Al configurar OAuth providers adicionales

---

### 3. [DATABASE.md](./DATABASE.md) 🗄️

**Base de Datos y Prisma ORM**

Contenido:

- Diagrama ER completo
- Modelos de Prisma detallados
- Relaciones entre tablas
- Índices y optimización de queries
- Ejemplos de uso de Prisma Client
- Migraciones y seeding
- Transacciones y manejo de errores
- Seguridad (SQL injection prevention, RLS)
- Testing con base de datos

**¿Cuándo leer este documento?**

- Para entender el esquema de datos
- Al crear nuevos modelos o relaciones
- Para optimizar queries lentas
- Al implementar nuevas features que requieren BD

---

### 4. [API.md](./API.md) 📡

**Documentación de API REST**

Contenido:

- Todos los endpoints disponibles
- Formato de requests y responses
- Parámetros de query y body
- Códigos de estado HTTP
- Ejemplos de uso con curl/Postman
- Manejo de errores estándar
- Rate limiting por endpoint
- Filtros, paginación y búsqueda

**Endpoints documentados:**

- `/auth` - Autenticación
- `/users` - Gestión de usuarios
- `/lists` - Listas de tareas
- `/tasks` - Tareas
- `/notifications` - Notificaciones
- `/permissions` - Permisos compartidos
- `/dashboard` - Estadísticas

**¿Cuándo leer este documento?**

- Para integrar el frontend con el backend
- Al crear nuevos endpoints
- Para entender los contratos de API
- Al debuggear llamadas HTTP

---

### 5. [DEPLOYMENT.md](./DEPLOYMENT.md) 🚀

**Guía de Despliegue y Uso**

Contenido:

- Acceso a la aplicación en producción
- Configuración de desarrollo local
- Variables de entorno requeridas
- Proceso de build y deployment
- Configuración de servicios (Vercel, Supabase)
- Troubleshooting común

**¿Cuándo leer este documento?**

- Para acceder a la aplicación
- Al configurar entorno de desarrollo
- Para contribuir al proyecto
- Al debuggear problemas de deployment

---

### 6. [SPRINTS.md](./SPRINTS.md) 📅

**Gestión del Proyecto por Sprints**

Contenido:

- Sprint 1: Configuración inicial y autenticación
- Sprint 2: Estructura visual y validación
- Sprint 3: Redux y BentoGrid
- Sprint 4: Tests y funcionalidades clave
- Sprint 5: Colaboración y notificaciones
- Sprint 6: Gamificación y refinamiento
- Sprint 7: Documentación y deployment final
- Capturas de pantalla de cada sprint
- Inconvenientes encontrados y soluciones

**¿Cuándo leer este documento?**

- Para entender la historia del proyecto
- Al planificar nuevos sprints
- Para contexto sobre decisiones técnicas
- Para presentaciones o demos

---

## 🎯 Guías Rápidas por Rol

### Para Desarrolladores Frontend

1. Empieza con [ARCHITECTURE.md](./ARCHITECTURE.md) - Sección "Frontend"
2. Lee [AUTHENTICATION.md](./AUTHENTICATION.md) - Sección "Integración en Frontend"
3. Consulta [API.md](./API.md) para endpoints disponibles
4. Revisa [DEPLOYMENT.md](./DEPLOYMENT.md) para configurar entorno local

### Para Desarrolladores Backend

1. Empieza con [ARCHITECTURE.md](./ARCHITECTURE.md) - Sección "Backend"
2. Lee [DATABASE.md](./DATABASE.md) para entender el esquema
3. Consulta [AUTHENTICATION.md](./AUTHENTICATION.md) - Sección "Verificación de Token"
4. Revisa [API.md](./API.md) para ver todos los endpoints

### Para DevOps / SysAdmin

1. Lee [DEPLOYMENT.md](./DEPLOYMENT.md) completo
2. Revisa [ARCHITECTURE.md](./ARCHITECTURE.md) - Secciones "Deployment" y "Escalabilidad"
3. Consulta [DATABASE.md](./DATABASE.md) - Sección "Migraciones"

### Para Product Managers / Stakeholders

1. Lee [SPRINTS.md](./SPRINTS.md) para el historial del proyecto
2. Consulta [ARCHITECTURE.md](./ARCHITECTURE.md) - Sección "Descripción General"
3. Revisa [API.md](./API.md) para entender funcionalidades disponibles

### Para QA / Testers

1. Consulta [API.md](./API.md) para endpoints a testear
2. Lee [AUTHENTICATION.md](./AUTHENTICATION.md) - Sección "Testing"
3. Revisa [DATABASE.md](./DATABASE.md) - Sección "Seeding" para datos de prueba

---

## 🔄 Mantenimiento de Documentación

### Actualización de Documentos

**Cuándo actualizar:**

- ✅ Al añadir nuevos endpoints → Actualizar [API.md](./API.md)
- ✅ Al cambiar modelos de BD → Actualizar [DATABASE.md](./DATABASE.md)
- ✅ Al modificar arquitectura → Actualizar [ARCHITECTURE.md](./ARCHITECTURE.md)
- ✅ Al finalizar sprint → Actualizar [SPRINTS.md](./SPRINTS.md)
- ✅ Al cambiar proceso de deployment → Actualizar [DEPLOYMENT.md](./DEPLOYMENT.md)

### Proceso de Actualización

1. Edita el archivo `.md` correspondiente
2. Verifica que los ejemplos de código funcionen
3. Actualiza diagramas si es necesario
4. Haz commit con mensaje descriptivo:
   ```bash
   git add docs/
   git commit -m "docs: actualizar API.md con nuevo endpoint /chatbot"
   git push origin develop
   ```

---

## 📊 Estadísticas de Documentación

| Archivo           | Tamaño | Última Actualización |
| ----------------- | ------ | -------------------- |
| ARCHITECTURE.md   | ~8KB   | 2025-01-08           |
| AUTHENTICATION.md | ~12KB  | 2025-01-08           |
| DATABASE.md       | ~10KB  | 2025-01-08           |
| API.md            | ~15KB  | 2025-01-08           |
| DEPLOYMENT.md     | ~6KB   | 2025-01-05           |
| SPRINTS.md        | ~7KB   | 2025-01-07           |

**Total:** ~58KB de documentación técnica

---

## 🎨 Recursos Visuales

### Diagramas Disponibles

- 📐 Arquitectura del Sistema (ARCHITECTURE.md)
- 🔐 Flujo de Autenticación (AUTHENTICATION.md)
- 🗄️ Diagrama ER de Base de Datos (DATABASE.md)

### Capturas de Sprint

Las capturas de cada sprint están en `/docs/Images/`:

- `sprint1.png` - Configuración inicial
- `sprint2.png` - UI y validación
- `sprint3.png` - Redux y BentoGrid
- `sprint4.png` - Tests
- `sprint5.png` - Colaboración
- `sprint6.png` - Gamificación
- `sprint7.png` - Documentación

---

## 🔗 Enlaces Útiles

### Repositorio y Código

- **GitHub:** https://github.com/SyTW2526/Proyecto-E13
- **Branch principal:** `develop`
- **Branch de producción:** `main`

### Aplicación

- **Producción:** https://taskgrid-proyecto-e13.vercel.app/
- **Staging:** (URL de staging si existe)

### Herramientas de Desarrollo

- **SonarQube:** (URL de análisis de código)
- **Coveralls:** https://coveralls.io/github/SyTW2526/Proyecto-E13
- **GitHub Actions:** Pipelines de CI/CD en el repositorio

### Servicios Externos

- **Supabase:** Base de datos PostgreSQL
- **Vercel:** Hosting de cliente y servidor
- **Google Cloud Console:** OAuth credentials

---

## 💡 Tips para Usar esta Documentación

### 1. Búsqueda Rápida

Usa `Ctrl+F` en cada archivo para buscar términos específicos como:

- "endpoint"
- "migration"
- "authentication"
- "test"

### 2. Navegación por Secciones

Cada archivo tiene un índice al inicio. Haz click en los enlaces para saltar a secciones específicas.

### 3. Ejemplos de Código

Todos los bloques de código son copiables y ejecutables. Ajusta las URLs y tokens según tu entorno.

### 4. Diagramas ASCII

Los diagramas en texto son compatibles con herramientas como:

- Mermaid (para convertir a visuales)
- Draw.io (para editar)
- PlantUML (para automatizar)

---

## 🤝 Contribuir a la Documentación

### Estilo y Formato

- ✅ Usa emojis para secciones principales
- ✅ Incluye ejemplos de código ejecutables
- ✅ Añade diagramas cuando sea posible
- ✅ Escribe en español claro y conciso
- ✅ Usa bloques de código con syntax highlighting
- ✅ Incluye respuestas de error en API docs

### Plantilla para Nuevos Documentos

````markdown
# 🎯 Título del Documento

## Descripción General

[Breve introducción de 2-3 líneas]

---

## 📋 Contenido

### Sección 1

[Explicación]

```code
// Ejemplo
```
````

### Sección 2

[Explicación]

---

## 🧪 Testing

[Ejemplos de tests]

---

## 📚 Referencias

- [Link 1](#)
- [Link 2](#)

```

---

## 📞 Contacto y Soporte

### Equipo de Desarrollo

- **Laura Álvarez Zamora** - [@alu0101349824](https://github.com/alu0101349824)
- **Tomás Pino Pérez** - [@tomas2p](https://github.com/tomas2p)
- **Joel Saavedra Páez** - [@Joelsaav](https://github.com/Joelsaav)

### Preguntas sobre Documentación

Si encuentras errores o tienes sugerencias:
1. Abre un issue en GitHub con label `documentation`
2. Propón cambios via Pull Request
3. Contacta al equipo de desarrollo

---

## 📝 Changelog de Documentación

### [2025-01-08] - Documentación Completa
- ✅ Creada arquitectura completa
- ✅ Documentado sistema de autenticación
- ✅ Documentada base de datos y Prisma
- ✅ Documentada API REST completa

### [2025-01-07] - Sprint 7
- ✅ Actualizado SPRINTS.md con Sprint 7
- ✅ Añadidas capturas finales

### [2025-01-05] - Deployment
- ✅ Creado DEPLOYMENT.md
- ✅ Añadidas instrucciones de producción

---

**Última actualización:** 2025-01-08
**Versión de documentación:** 1.0.0
**Mantenedores:** Equipo TaskGrid
```
