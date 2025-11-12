import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Theme, ThemeState } from "@/types/theme";

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
      const root = document.documentElement;
      if (action.payload === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      state.theme = newTheme;
      localStorage.setItem("theme", newTheme);
      const root = document.documentElement;
      if (newTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
export const selectTheme = (state: { theme: ThemeState }) => state.theme.theme;
export const selectIsDark = (state: { theme: ThemeState }) =>
  state.theme.theme === "dark";
