# 🔐 Sistema de Autenticación - TaskGrid

## Descripción General

TaskGrid implementa un sistema de autenticación robusto y seguro que soporta **dos métodos**:

1. **Autenticación tradicional** con email y contraseña
2. **OAuth 2.0** con Google

Ambos métodos utilizan **JWT (JSON Web Tokens)** para mantener las sesiones de usuario.

---

## 🎯 Métodos de Autenticación

### 1. Registro y Login Tradicional

#### **Registro de Usuario**

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "Password123!",
  "name": "Juan Pérez"
}
```

**Flujo:**

1. Frontend envía credenciales al backend
2. Backend valida formato con Zod schema
3. Verifica que el email no exista
4. Hashea la contraseña con bcrypt (10 rounds)
5. Crea usuario en la base de datos
6. Genera JWT con payload: `{ id, email, name }`
7. Retorna token y datos del usuario

**Respuesta exitosa:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-...",
      "email": "usuario@example.com",
      "name": "Juan Pérez",
      "avatar": null,
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **Login de Usuario**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

**Flujo:**

1. Backend busca usuario por email
2. Compara contraseña con bcrypt.compare()
3. Si coincide, genera JWT
4. Retorna token y datos del usuario

---

### 2. Google OAuth 2.0

#### **Configuración OAuth**

La aplicación utiliza OAuth 2.0 con Google para proporcionar autenticación segura sin necesidad de gestionar contraseñas adicionales. La configuración es gestionada internamente por nuestro equipo de seguridad.

#### **Flujo de Autenticación**

```plaintext
┌─────────┐         ┌─────────┐         ┌──────────┐         ┌──────┐
│ Cliente │         │ TaskGrid│         │  Google  │         │  DB  │
└────┬────┘         └────┬────┘         └────┬─────┘         └──┬───┘
     │                   │                    │                  │
     │ Click "Login Google"                   │                  │
     │──────────────────>│                    │                  │
     │                   │                    │                  │
     │                   │ Redirect a Google  │                  │
     │<──────────────────│                    │                  │
     │                                        │                  │
     │ Autorización de usuario                │                  │
     │───────────────────────────────────────>│                  │
     │                                        │                  │
     │ Callback con code                      │                  │
     │<───────────────────────────────────────│                  │
     │                   │                    │                  │
     │ POST code         │                    │                  │
     │──────────────────>│                    │                  │
     │                   │                    │                  │
     │                   │ Exchange code      │                  │
     │                   │ por access_token   │                  │
     │                   │───────────────────>│                  │
     │                   │                    │                  │
     │                   │<───────────────────│                  │
     │                   │  access_token      │                  │
     │                   │                    │                  │
     │                   │ GET user info      │                  │
     │                   │───────────────────>│                  │
     │                   │                    │                  │
     │                   │<───────────────────│                  │
     │                   │  {email, name, pic}│                  │
     │                   │                    │                  │
     │                   │ Busca o crea user  │                  │
     │                   │──────────────────────────────────────>│
     │                   │                                       │
     │                   │<──────────────────────────────────────│
     │                   │ Usuario encontrado/creado             │
     │                   │                                       │
     │                   │ Genera JWT                            │
     │                   │                                       │
     │  JWT + User data  │                                       │
     │<──────────────────│                                       │
```

#### **Cómo Funciona (Vista del Usuario)**

1. El usuario hace clic en el botón "Iniciar sesión con Google"
2. Se abre una ventana de Google donde el usuario autoriza el acceso
3. Google valida la identidad y redirige de vuelta a TaskGrid
4. La aplicación crea o actualiza la cuenta del usuario automáticamente
5. El usuario queda autenticado y es redirigido al dashboard

Todo el proceso es seguro y no requiere que el usuario cree una contraseña adicional.

#### **Proceso Interno de Autenticación**

Cuando un usuario se autentica con Google, nuestro sistema:

1. **Recibe la autorización** de Google con la identidad verificada del usuario
2. **Obtiene información básica** del perfil (nombre, email, foto)
3. **Busca o crea** una cuenta en nuestra base de datos
4. **Genera un token de sesión** seguro para el usuario
5. **Devuelve** el token y la información del perfil al navegador

Todo el proceso cumple con los estándares de seguridad OAuth 2.0 y las mejores prácticas de la industria.

---

## 🔑 JWT (JSON Web Token)

### Estructura del Token

```plaintext
Header.Payload.Signature
```

**Header:**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**

```json
{
  "id": "user-uuid",
  "email": "usuario@example.com",
  "iat": 1640000000,
  "exp": 1640086400
}
```

**Signature:**

```plaintext
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### Generación y Verificación de Tokens

Cuando un usuario inicia sesión exitosamente:

1. **Se genera un token** que contiene información básica del usuario (ID, email, nombre)
2. El token tiene una **duración de 24 horas** por seguridad
3. El token está **firmado digitalmente** para prevenir falsificaciones

En cada petición protegida:

1. El sistema **verifica la autenticidad** del token
2. Comprueba que **no haya expirado**
3. Extrae la información del usuario para procesar la petición
4. Si el token es inválido o expiró, se solicita **login nuevamente**

---

## 🛡️ Seguridad

### 1. **Protección de Contraseñas**

Las contraseñas nunca se almacenan en texto plano. Utilizamos:

- **Algoritmos de hashing robustos** que convierten la contraseña en una cadena irreversible
- **Salt (sal criptográfica)** único para cada contraseña
- **Proceso computacionalmente costoso** para prevenir ataques de fuerza bruta

Cuando inicias sesión, comparamos el hash de tu contraseña con el almacenado, sin revelar nunca la contraseña original.

### 2. **Validación de Datos**

Todos los datos de entrada son validados estrictamente:

**Requisitos para registro:**
- Email válido y único
- Contraseña de mínimo 8 caracteres
- Debe contener: mayúsculas, minúsculas, números y símbolos
- Nombre entre 2 y 50 caracteres

La validación ocurre tanto en el navegador (feedback inmediato) como en el servidor (seguridad).

### 3. **Protección contra Ataques**

**Rate Limiting (Límite de intentos):**
- Máximo 5 intentos de login en 15 minutos
- Previene ataques de fuerza bruta
- Si excedes el límite, debes esperar antes de reintentar

Esto protege tu cuenta y la plataforma de accesos no autorizados.

### 4. **Seguridad de Comunicación**

**CORS (Cross-Origin Resource Sharing):**
- Solo permite peticiones desde nuestros dominios autorizados
- Bloquea intentos de acceso desde sitios no autorizados
- Protege contra ataques de sitios maliciosos

Todas las comunicaciones se realizan sobre HTTPS encriptado.

---

## 📱 Cómo Funciona la Sesión

### Gestión de Estado

La aplicación mantiene tu sesión activa de forma segura:

- **Al iniciar sesión:** Tu token se guarda de forma segura en tu navegador
- **Navegando por la app:** Cada petición incluye automáticamente tu token de autenticación
- **Cierre automático:** Si tu sesión expira (24h), se solicita login nuevamente
- **Al cerrar sesión:** Se elimina toda la información de autenticación

Tu información personal está siempre protegida y solo tú tienes acceso a ella.

### Rutas Protegidas

Algunas páginas de la aplicación requieren autenticación:

- **Dashboard:** Vista principal con tus tareas
- **Listas:** Gestión de tus listas de tareas
- **Perfil:** Configuración de tu cuenta
- **Notificaciones:** Tus alertas y avisos

Si intentas acceder sin estar autenticado, serás redirigido a la página de login automáticamente.

### Gestión Automática de Tokens

La aplicación maneja automáticamente:

1. **Incluir tu token** en todas las peticiones protegidas
2. **Detectar cuando expira** tu sesión
3. **Redirigir al login** si es necesario
4. **Limpiar datos sensibles** al cerrar sesión

No necesitas preocuparte por la gestión técnica, todo funciona de forma transparente.

---

## 🧪 Testing y Calidad

La autenticación está completamente probada para garantizar:

- Registro exitoso de nuevos usuarios
- Login con credenciales válidas
- Rechazo de credenciales incorrectas
- Protección contra intentos de acceso no autorizado
- Funcionamiento correcto del formulario de login
- Validación de campos en tiempo real
- Manejo adecuado de errores

Mantenemos altos estándares de calidad y seguridad en todo el sistema.

---

## 🔄 Flujo Completo de Usuario

### 1. Primera Visita (Sin Autenticar)

```
Usuario → Landing Page → Click "Registrarse"
  → Formulario de Registro → Submit
  → Backend valida y crea usuario
  → Frontend guarda token → Redirect a Dashboard
```

### 2. Usuario Registrado (Login)

```
Usuario → Login Page → Ingresa credenciales → Submit
  → Backend verifica → Genera JWT
  → Frontend guarda token → Redirect a Dashboard
```

### 3. Sesión Activa

```
Usuario → Dashboard (token en localStorage)
  → Cada petición incluye: Authorization: Bearer {token}
  → Backend verifica token en middleware
  → Si válido: procesa petición
  → Si expirado/inválido: 401 → Redirect a Login
```

### 4. Logout

```
Usuario → Click "Cerrar Sesión"
  → Frontend elimina token de localStorage
  → Redux limpia estado de usuario
  → Redirect a Landing Page
```

---

## 🚨 Manejo de Errores

### Errores Comunes

| Error                  | Código | Causa                                 | Solución                      |
| ---------------------- | ------ | ------------------------------------- | ----------------------------- |
| Token no proporcionado | 401    | No se envió header Authorization      | Incluir token en peticiones   |
| Token inválido         | 403    | Token malformado o firma incorrecta   | Regenerar token (login again) |
| Token expirado         | 403    | Pasaron más de 24h                    | Login nuevamente              |
| Credenciales inválidas | 401    | Email o password incorrectos          | Verificar credenciales        |
| Email ya registrado    | 409    | Usuario intenta registrarse dos veces | Usar login en vez de registro |
| Rate limit excedido    | 429    | Demasiados intentos de login          | Esperar 15 minutos            |

---

## 📚 Próximas Mejoras

1. **Refresh Tokens:**

   - Access token: 15 minutos
   - Refresh token: 7 días
   - Endpoint `/auth/refresh`

2. **2FA (Two-Factor Authentication):**

   - TOTP con Google Authenticator
   - SMS backup codes

3. **Password Recovery:**

   - Email con token de recuperación
   - Expira en 1 hora

4. **Social Login adicional:**

   - GitHub OAuth
   - Microsoft OAuth

5. **Session Management:**
   - Lista de dispositivos activos
   - Logout remoto de dispositivos

---

## 🔗 Referencias

- [JWT.io](https://jwt.io/)
- [OAuth 2.0 RFC](https://datatracker.ietf.org/doc/html/rfc6749)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [bcrypt npm](https://www.npmjs.com/package/bcrypt)
- [Zod Documentation](https://zod.dev/)
