import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import themeReducer from "@/store/slices/themeSlice";

describe("useRedux", () => {
  const createWrapper = (store: ReturnType<typeof configureStore>) => {
    return ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  };

  describe("useAppDispatch", () => {
    it("should return dispatch function", () => {
      const store = configureStore({
        reducer: {
          theme: themeReducer,
        },
      });

      const { result } = renderHook(() => useAppDispatch(), {
        wrapper: createWrapper(store),
      });

      expect(typeof result.current).toBe("function");
    });

    it("should dispatch actions correctly", () => {
      const store = configureStore({
        reducer: {
          theme: themeReducer,
        },
      });

      const { result } = renderHook(() => useAppDispatch(), {
        wrapper: createWrapper(store),
      });

      const dispatch = result.current;

      expect(() => {
        dispatch({ type: "theme/setTheme", payload: "dark" });
      }).not.toThrow();
    });
  });

  describe("useAppSelector", () => {
    it("should select state correctly", () => {
      const store = configureStore({
        reducer: {
          theme: themeReducer,
        },
        preloadedState: {
          theme: {
            theme: "dark",
          },
        },
      });

      const { result } = renderHook(
        () => useAppSelector((state) => state.theme.theme),
        {
          wrapper: createWrapper(store),
        },
      );

      expect(result.current).toBe("dark");
    });

    it("should update when state changes", async () => {
      const store = configureStore({
        reducer: {
          theme: themeReducer,
        },
        preloadedState: {
          theme: {
            theme: "light",
          },
        },
      });

      const { result, rerender } = renderHook(
        () => useAppSelector((state) => state.theme.theme),
        {
          wrapper: createWrapper(store),
        },
      );

      expect(result.current).toBe("light");

      store.dispatch({ type: "theme/setTheme", payload: "dark" });
      await new Promise((resolve) => setTimeout(resolve, 0));
      rerender();

      expect(result.current).toBe("dark");
    });
  });
});
