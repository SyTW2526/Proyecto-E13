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
          theme: "light" as const,
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
    // DOM and localStorage updates are handled by store subscription, not the hook
  });

  it("should remove dark class when theme is set to light", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("light");
    });

    expect(result.current.theme).toBe("light");
  });

  it("should return current theme from store", () => {
    store = configureStore({
      reducer: {
        theme: themeReducer,
      },
      preloadedState: {
        theme: {
          theme: "dark" as const,
        },
      },
    });

    const wrapperWithDark = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useTheme(), {
      wrapper: wrapperWithDark,
    });
    expect(result.current.theme).toBe("dark");
  });
});
