/**
 * @file ThemeToggle.tsx
 * @description Componente para alternar entre temas claro y oscuro.
 * Utiliza un hook personalizado para gestionar el estado del tema.
 */
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "./ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <Button variant="default" onClick={() => setTheme(next)}>
      {theme === "dark" ? (
        <IconSun size={20} stroke={2} />
      ) : (
        <IconMoon size={20} stroke={2} />
      )}
    </Button>
  );
}
