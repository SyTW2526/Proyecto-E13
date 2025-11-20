import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useTheme } from "@/hooks/useTheme";
import themeReducer from "@/store/slices/themeSlice";

describe("useTheme", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    vi.spyOn(localStorage, "setItem");
    vi.spyOn(localStorage, "getItem");

    store = configureStore({
      reducer: {
        theme: themeReducer,
      },
      preloadedState: {
        theme: {
          theme: "light",
        },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it("should return current theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe("light");
  });

  it("should update theme when setTheme is called", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("should remove dark class when theme is set to light", () => {
    document.documentElement.classList.add("dark");

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("light");
    });

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("should apply theme to DOM on mount", () => {
    store = configureStore({
      reducer: {
        theme: themeReducer,
      },
      preloadedState: {
        theme: {
          theme: "dark",
        },
      },
    });

    const wrapperWithDark = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useTheme(), { wrapper: wrapperWithDark });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
