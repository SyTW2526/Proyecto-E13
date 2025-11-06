// client/src/App.tsx
/**
 * @file App.tsx
 * @description Componente principal de la aplicación que maneja el enrutamiento y la estructura básica.
 * Incluye la navegación entre páginas, el toggle del tema y el pie de página fijo.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SettingsPage from "@/pages/SettingsPage";
import SitemapPage from "@/pages/SitemapPage";
import ContactsPage from "@/pages/ContactsPage";
import StickyFooter from "@/components/StickyFooter";
import ThemeToggle from "@/components/ThemeToggle";

// Páginas que todavía no tienen su propio archivo
const Home = () => <div className="p-6">Inicio</div>;
const Tasks = () => <div className="p-6">Tareas</div>;
const Notifications = () => <div className="p-6">Notificaciones</div>;

export default function App() {
  return (
    <>
      <div className="fixed z-50 right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))]">
        <ThemeToggle />
      </div>

      <main className="pb-16">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      <StickyFooter />
    </>
  );
}
