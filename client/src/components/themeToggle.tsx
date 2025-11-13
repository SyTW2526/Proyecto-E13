/**
 * @file ThemeToggle.tsx
 * @description Componente para alternar entre temas claro y oscuro.
 * Utiliza un hook personalizado para gestionar el estado del tema.
 */
import { useTheme } from "@/hooks/useTheme";
import { Button } from "./ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <Button
      leftIcon={next === "dark" ? "IconSun" : "IconMoon"}
      aria-label={`Cambiar a tema ${next}`}
      onClick={() => setTheme(next)}
    />
  );
}
