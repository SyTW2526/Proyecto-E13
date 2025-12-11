# Gestión del Proyecto por Sprints

El desarrollo de TaskGrid se ha estructurado en una serie de sprints, realizados mediante la aplicación Jira, cada uno con objetivos específicos para garantizar un progreso constante y organizado. A continuación se detallan los objetivos y logros de cada sprint:

## Sprint 1 - Configuración Inicial y Primeros Pasos

- Configuración del entorno backend con Node.js y Express
- Configuración del entorno frontend con React y Vite
- Configuración de base de datos local y remota mediante Prisma ORM
- Diseño y creación de modelos de datos en Prisma
- Implementación de sistema de autenticación JWT
- Desarrollo de interfaz frontend para Login y Registro
- Desarrollo de endpoints REST para gestión de usuarios
- Implementación de endpoint para la página de inicio

![Sprint 1](./docs/Images/sprint1.png)

## Sprint 2 – Estructura Visual y Validación

- Diseño e implementación del header de la aplicación
- Diseño e implementación del footer de la aplicación
- Creación de schemas de validación con Zod en el backend
- Desarrollo de middlewares de validación con Zod en el backend
- Finalización del sistema de autenticación JWT
- Completado del frontend para Login y Registro
- Diseño de la interfaz del BentoGrid para la página principal

![Sprint 2](./docs/Images/sprint2.png)

## Sprint 3 – Integración Visual y Estado

- Implementación de Redux para el manejo centralizado del estado
- Desarrollo completo del componente BentoGrid
- Creación de endpoints para la configuración de usuario
- Desarrollo del frontend de configuración de usuario
- Integración de Google OAuth para autenticación alternativa
- **Pendientes para el siguiente sprint**:
  - Finalización de middlewares de validación con Zod en backend
  - Completar diseño del BentoGrid de la página principal

![Sprint 3](./docs/Images/sprint3.png)

## Sprint 4 – Tests y Funcionalidades Clave

- Desarrollo completo del frontend de la página de tareas
- Implementación de tests unitarios (UT) en el frontend
- Desarrollo de tests End-to-End (E2E) con Selenium
- Implementación de tests unitarios (UT) en el backend
- Sistema robusto de manejo y presentación de errores al usuario
- Desarrollo de funciones de filtrado para el dashboard resumen
- Implementación de validación con Zod en el frontend

![Sprint 4](./docs/Images/sprint4.png)

## Sprint 5 – Finalización de Funcionalidades

- Desarrollo de filtros de búsqueda avanzada de tareas
- Implementación del sistema de colaboración entre usuarios
- Sistema completo de notificaciones en tiempo real
- Configuración de integración continua con GitHub Actions
- Desarrollo del sistema de permisos para listas y tareas
- Finalización de la implementación de la página de tareas
- Completado de los filtros del Dashboard
- Refactorización de modelos de datos (eliminación de categorías)
- _Inconveniente:_ No se pudo completar la integración con Coveralls debido a falta de permisos para hacer el repositorio público. Solicitud de acceso pendiente por parte de la organización de la asignatura.

![Sprint 5](./docs/Images/sprint5.png)

## Sprint 6 – Gamificación y Refinamiento

- Sistema de puntuación y gamificación
- Preferencias de idioma para usuarios autenticados
- ChatBot de ayuda para usuarios autenticados
- Implementación de página de tareas compartidas
- Gestión de errores en páginas de tareas y compartidas
- Integración de SonarQube y Coveralls para análisis de calidad
- Refinamiento del diseño visual
- Optimización de tests unitarios (UT)
- **Inconveniente**:
  - Se decidión no implementar el sistema de puntuación y gamificación debido a limitaciones de tiempo y recursos. En su lugar, se priorizó la mejora de otras funcionalidades clave y la estabilidad general de la aplicación.

![Sprint 6](./docs/Images/sprint6.png)

## Sprint 7 – Documentación y Despliegue

- Ampliación de la suite de tests con cobertura del 96% en el backend y al 86% en el frontend
- Documentación completa del proyecto y mejoras en README
- ChatBot de ayuda para usuarios autenticados
- Preparación y configuración final para despliegue en producción
- Optimización y refinamiento de la aplicación para entrega final

![Sprint 7](./docs/Images/sprint7.png)
