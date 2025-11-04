// client/src/components/ThemeToggle.tsx
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
