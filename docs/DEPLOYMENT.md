# Guía de Uso - TaskGrid

Bienvenido a **TaskGrid**, la plataforma líder en gestión colaborativa de tareas. Este documento te guiará para usar nuestra aplicación.

---

## 🌐 Acceso a la Aplicación

### Aplicación Web

Accede directamente a TaskGrid desde tu navegador:

**🔗 [https://taskgrid-proyecto-e13.vercel.app/](https://taskgrid-proyecto-e13.vercel.app/)**

No necesitas instalar nada. Solo crea tu cuenta y comienza a organizar tus tareas desde cualquier dispositivo con acceso a internet.

---

## 🏠 Desarrollo Local (Solo para Colaboradores Autorizados)

Si eres parte del equipo de desarrollo de TaskGrid, puedes ejecutar una instancia local para contribuir al proyecto.

### Requisitos Previos

- Node.js (versión 18.x o superior)
- Acceso autorizado al repositorio privado
- Credenciales de acceso a la base de datos proporcionadas por el equipo

### 1. Configuración Inicial

Contacta con el equipo de DevOps para obtener:

- Acceso al repositorio
- Archivo `.env` con credenciales válidas
- Permisos de base de datos

> **⚠️ Nota de Seguridad:** Las credenciales y configuraciones sensibles nunca se comparten públicamente. Solo el equipo autorizado tiene acceso.

### 2. Instalar Dependencias

```bash
# Backend
cd ./server
npm install

# Frontend
cd ./client
npm install
```

### 3. Inicializar Base de Datos

```bash
cd server
npm run prisma:generate
```

### 4. Iniciar la Aplicación en Modo Desarrollo

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🌐 Despliegue y Arquitectura

La aplicación está desplegada en infraestructura cloud moderna que garantiza:

### Características

- **Alta disponibilidad:** Acceso 24/7 desde cualquier lugar
- **Rendimiento optimizado:** Tiempos de carga rápidos
- **Escalabilidad:** Soporte para múltiples usuarios simultáneos
- **Seguridad:** Encriptación HTTPS en todas las comunicaciones

### Arquitectura

- **Frontend:** Interfaz de usuario moderna y responsiva
- **Backend:** API REST segura con autenticación
- **Base de Datos:** PostgreSQL gestionado en infraestructura cloud privada

### Actualizaciones y Releases

Las actualizaciones de TaskGrid se despliegan automáticamente por nuestro equipo de DevOps. Los usuarios siempre acceden a la última versión estable sin necesidad de actualizar manualmente.

---

## 🔧 Funcionalidades Disponibles

### Para Usuarios Finales

- ✅ Registro e inicio de sesión (email/password o Google OAuth)
- ✅ Creación y gestión de tareas personales
- ✅ Organización por listas y prioridades
- ✅ Compartir tareas con otros usuarios
- ✅ Sistema de notificaciones en tiempo real
- ✅ Dashboard con estadísticas y gráficos
- ✅ Chatbot con IA para asistencia
- ✅ Soporte multiidioma (Español/Inglés)
- ✅ Modo claro/oscuro

### Para Desarrolladores Autorizados

Si eres parte del equipo de desarrollo, contacta con DevOps para:

- Acceso al repositorio privado
- Credenciales de desarrollo
- Documentación técnica interna
- Guías de contribución

Los colaboradores autorizados pueden ejecutar instancias locales para desarrollo y testing.

---

## 🐛 Reporte de Problemas

Si encuentras algún problema usando TaskGrid:

1. **Usuarios finales:** Contacta con soporte a través del chatbot integrado en la aplicación o vía email.
2. **Colaboradores:** Reporta issues en el repositorio interno del proyecto.

---

## 📱 Compatibilidad

TaskGrid está optimizado para funcionar en:

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móviles (responsive design)
- ✅ Tablets y desktops

---

## 🔒 Seguridad y Privacidad

En TaskGrid nos tomamos muy en serio la seguridad:

- 🔐 Autenticación JWT con tokens seguros
- 🔐 Encriptación de contraseñas con bcrypt
- 🔐 Conexiones HTTPS en producción
- 🔐 Validación de datos con Zod
- 🔐 Protección contra ataques comunes

**Política de Privacidad:** Nunca compartimos tus datos con terceros. Toda la información está protegida y encriptada.

---

## 📞 Contacto y Soporte

### Equipo de TaskGrid

- Joel Saavedra Páez - Team Lead & Project Manager
- Laura Álvarez Zamora - QA Engineer & Security Specialist
- Tomás Pino Pérez - Frontend Developer & UI/UX Designer

### Links Útiles

- 🌐 **Aplicación:** [https://taskgrid-proyecto-e13.vercel.app/](https://taskgrid-proyecto-e13.vercel.app/)
- 📧 **Soporte:** Usa el chatbot dentro de la aplicación
- 📦 **Repositorio:** Acceso restringido a colaboradores autorizados

---

© 2025 TaskGrid - Todos los derechos reservados
