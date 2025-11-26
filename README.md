# Gestor de Tareas Colaborativo

Aplicación Fullstack colaborativa para crear, organizar y compartir tareas de forma visual y sencilla, combinando el estilo de _Google Tasks_ y _Trello_.

## Autores

[![Integrante1](https://img.shields.io/badge/Laura%20Álvarez%20Zamora-alu0101349824-white?style=for-the-badge)](https://github.com/alu0101349824)
[![Integrante2](https://img.shields.io/badge/Tomás%20Pino%20Pérez-alu0101474311-white?style=for-the-badge)](https://github.com/tomas2p)
[![Integrante3](https://img.shields.io/badge/Joel%20Saavedra%20Páez-alu0101437415-white?style=for-the-badge)](https://github.com/Joelsaav)

## Insignias de estado

[![CI Tests (Client)](https://github.com/SyTW2526/Proyecto-E13/actions/workflows/ci-client.yml/badge.svg)](https://github.com/SyTW2526/Proyecto-E13/actions/workflows/ci-client.yml)
[![CI Tests (Server)](https://github.com/SyTW2526/Proyecto-E13/actions/workflows/ci-server.yml/badge.svg)](https://github.com/SyTW2526/Proyecto-E13/actions/workflows/ci-server.yml)

## Sprint 1 - Configuración Inicial y Primeros Pasos

- Configuración del proyecto (backend, frontend y base de datos con Prisma)
- Configuración del repositorio y tablero Jira
- Gestión de usuarios (registro, inicio de sesión)
- Primeros endpoints
- Base del diseño inicial del frontend

![Sprint 1](./docs/Images/it1.png)

## Sprint 2 - Autenticación y Control de Sesión

- Implementación de login y registro funcionales
- Autenticación con Google/Auth0
- Control de sesión mediante JWT
- Gestión de estado global con React Redux
- Diseño responsivo de pantallas de login y registro
- Integración inicial del Dashboard
- **Quedaron pendientes para el siguiente sprint:**
  - Middlewares de validación con Zod en backend
  - Diseño frontend del Bento Grid de la página principal

![Sprint 2](./docs/Images/it2.png)

## Sprint 3 - Pruebas y Calidad del Software

- Creación de tests unitarios frontend y backend con Vitest
- Creación de tests end-to-end con Selenium IDE
- Verificación de flujos completos de usuario (login, navegación, logout)
- Implementación de mocks de backend y frontend
- Finalización del Dashboard del sprint
- Cambio de alcance en Jira (renombrado y reorganización de tareas)

![Sprint 3](./docs/Images/it3.png)

## Sprint 4 - Integración Continua y Base de la Página de Tareas

- Configuración de GitHub Actions para cliente y servidor
- Ejecución automática de pruebas en cada actualización del repositorio
- Finalización de integración de Google Auth0
- Manejo de estado con Redux aplicado a más secciones
- Implementación de endpoints necesarios para el Bento Grid
- Diseño frontend del Bento Grid de la página principal
- Ajustes de usuario (nombre, contraseña, notificaciones)
- Preparación de la base del frontend para la página de tareas
- Inicio de implementación de funcionalidades de tareas
- _Inconveniente:_ No se pudo completar la integración con Coveralls debido a falta de permisos para hacer el repositorio público. Solicitud de acceso pendiente por parte de la organización de la asignatura

![Sprint 4](./docs/Images/it4.png)

## Stack Tecnológico

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
