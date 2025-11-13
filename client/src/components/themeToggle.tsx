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
      variant="default"
      leftIcon={next === "dark" ? "IconSun" : "IconMoon"}
      iconSize={20}
      aria-label={`Cambiar a tema ${next}`}
      className="mr-0"
      onClick={() => setTheme(next)}
    >
      <span className="ml-0 sr-only">Cambiar a tema {next}</span>
    </Button>
  );
}
