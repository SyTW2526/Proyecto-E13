// client/src/components/ThemeToggle.tsx
/**
 * @file ThemeToggle.tsx
 * @description Componente para alternar entre temas claro y oscuro.
 * Utiliza un hook personalizado para gestionar el estado del tema.
 */
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="fixed right-4 top-4 z-50 rounded-full border px-3 py-1 text-sm shadow-sm hover:bg-accent"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? "Modo claro" : "Modo oscuro"}
    </button>
  );
}
