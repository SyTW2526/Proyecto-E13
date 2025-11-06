// client/src/hooks/useTheme.ts
/**
 * @file useTheme.ts
 * @description Hook personalizado para manejar el tema de la aplicación (claro/oscuro).
 * Gestiona la persistencia del tema y sincroniza con las preferencias del sistema.
 */

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitial(): Theme {
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
