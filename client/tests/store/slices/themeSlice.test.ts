import { describe, it, expect, beforeEach } from "vitest";
import themeReducer, {
  setTheme,
  toggleTheme,
  selectTheme,
  selectIsDark,
} from "@/store/slices/themeSlice";
import type { ThemeState } from "@/types/theme";

describe("themeSlice", () => {
  let initialState: ThemeState;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    initialState = {
      theme: "light",
    };
  });

  describe("reducer", () => {
    it("should return initial state", () => {
      expect(themeReducer(undefined, { type: "unknown" })).toEqual({
        theme: expect.any(String),
      });
    });

    it("should handle setTheme action", () => {
      const action = setTheme("dark");
      const state = themeReducer(initialState, action);

      expect(state.theme).toBe("dark");
      expect(localStorage.getItem("theme")).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should handle toggleTheme action from light to dark", () => {
      const action = toggleTheme();
      const state = themeReducer(initialState, action);

      expect(state.theme).toBe("dark");
      expect(localStorage.getItem("theme")).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should handle toggleTheme action from dark to light", () => {
      const darkState: ThemeState = { theme: "dark" };
      const action = toggleTheme();
      const state = themeReducer(darkState, action);

      expect(state.theme).toBe("light");
      expect(localStorage.getItem("theme")).toBe("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("should update localStorage when theme changes", () => {
      const action = setTheme("dark");
      themeReducer(initialState, action);

      expect(localStorage.getItem("theme")).toBe("dark");
    });
  });

  describe("selectors", () => {
    it("selectTheme should return theme", () => {
      const state = { theme: { theme: "dark" as const } };
      expect(selectTheme(state as any)).toBe("dark");
    });

    it("selectIsDark should return true for dark theme", () => {
      const state = { theme: { theme: "dark" as const } };
      expect(selectIsDark(state as any)).toBe(true);
    });

    it("selectIsDark should return false for light theme", () => {
      const state = { theme: { theme: "light" as const } };
      expect(selectIsDark(state as any)).toBe(false);
    });
  });
});
