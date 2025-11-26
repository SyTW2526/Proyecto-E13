import { describe, it, expect, beforeEach } from "vitest";
import themeReducer, {
  setTheme,
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
      // Side effects are now handled by store subscription, not reducer
    });
  });

  describe("selectors", () => {
    it("selectTheme should return theme", () => {
      const state = { theme: { theme: "dark" as const } };
      expect(selectTheme(state)).toBe("dark");
    });

    it("selectIsDark should return true for dark theme", () => {
      const state = { theme: { theme: "dark" as const } };
      expect(selectIsDark(state)).toBe(true);
    });

    it("selectIsDark should return false for light theme", () => {
      const state = { theme: { theme: "light" as const } };
      expect(selectIsDark(state)).toBe(false);
    });
  });
});
