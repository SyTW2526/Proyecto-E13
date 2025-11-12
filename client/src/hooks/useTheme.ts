/**
 * @file useTheme.ts
 * @description Hook personalizado para manejar el tema de la aplicación (claro/oscuro).
 * Ahora usa Redux para gestionar el estado global del tema.
 */

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  selectTheme,
  setTheme as setThemeAction,
} from "@/store/slices/themeSlice";
import { Theme } from "@/types/theme";

export function useTheme() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  /**
   * Aplicar el tema al DOM cuando se monta el componente
   * Esto asegura que el tema se aplique correctamente al cargar la página
   */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);
  /**
   * Función para cambiar el tema
   * Usa Redux para que el cambio se propague a toda la aplicación
   */
  const setTheme = (newTheme: Theme) => {
    dispatch(setThemeAction(newTheme));
  };

  return { theme, setTheme };
}
