// client/src/config/sitemap.ts
/**
 * @file sitemap.ts
 * @description Configuración del mapa del sitio y la navegación.
 * Define las rutas y los iconos asociados a cada sección de la aplicación.
 */

import {
  Home,
  ListTodo,
  Bell,
  Settings,
  LogIn,
  UserPlus,
  Map,
  Users,
} from "lucide-react";

// Mapa del sitio de la aplicación
export const sitemap = [
  { label: "Inicio", href: "/home", Icon: Home },
  { label: "Tareas", href: "/tasks", Icon: ListTodo },
  { label: "Notificaciones", href: "/notifications", Icon: Bell },
  { label: "Ajustes", href: "/settings", Icon: Settings },
  { label: "Mapa del sitio", href: "/sitemap", Icon: Map },
  { label: "Contactos", href: "/contacts", Icon: Users },
  { label: "Registro", href: "/register", Icon: UserPlus },
  { label: "Login", href: "/login", Icon: LogIn },
];

// Rutas donde el footer no debe mostrarse
export const footerHiddenOn = ["/login", "/register"];
