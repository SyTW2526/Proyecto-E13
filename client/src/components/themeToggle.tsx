/**
 * @file ThemeToggle.tsx
 * @description Componente para alternar entre temas claro y oscuro.
 * Utiliza un hook personalizado para gestionar el estado del tema.
 */
import { useTheme } from "@/hooks/useTheme";
import { Button } from "./ui/button";
import Icon from "./ui/icon";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <Button variant="default" onClick={() => setTheme(next)}>
      <Icon
        as={next === "dark" ? "IconSun" : "IconMoon"}
        size={20}
        stroke={2}
      />
    </Button>
  );
}
