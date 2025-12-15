import { useUI } from "@/hooks/ui/useUI";
import authReducer from "@/store/slices/authSlice";
import themeReducer from "@/store/slices/themeSlice";
import uiReducer from "@/store/slices/uiSlice";
import { configureStore } from "@reduxjs/toolkit";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("useUI", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
        ui: uiReducer,
      },
      preloadedState: {
        ui: { sidebarWidth: "normal", taskCardSize: 2 },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it("returns sidebarWidth from store", () => {
    const { result } = renderHook(() => useUI(), { wrapper });
    expect(result.current.sidebarWidth).toBe("normal");
  });

  it("returns taskCardSize from store", () => {
    const { result } = renderHook(() => useUI(), { wrapper });
    expect(result.current.taskCardSize).toBe(2);
  });

  it("provides setSidebarWidth function", () => {
    const { result } = renderHook(() => useUI(), { wrapper });
    expect(typeof result.current.setSidebarWidth).toBe("function");
  });

  it("provides setTaskCardSize function", () => {
    const { result } = renderHook(() => useUI(), { wrapper });
    expect(typeof result.current.setTaskCardSize).toBe("function");
  });

  it("setSidebarWidth updates the store", () => {
    const { result } = renderHook(() => useUI(), { wrapper });

    act(() => {
      result.current.setSidebarWidth("compact");
    });

    expect(result.current.sidebarWidth).toBe("compact");
  });

  it("setSidebarWidth to wide updates store", () => {
    const { result } = renderHook(() => useUI(), { wrapper });

    act(() => {
      result.current.setSidebarWidth("wide");
    });

    expect(result.current.sidebarWidth).toBe("wide");
  });

  it("setTaskCardSize updates the store", () => {
    const { result } = renderHook(() => useUI(), { wrapper });

    act(() => {
      result.current.setTaskCardSize(3);
    });

    expect(result.current.taskCardSize).toBe(3);
  });

  it("setTaskCardSize to maximum updates store", () => {
    const { result } = renderHook(() => useUI(), { wrapper });

    act(() => {
      result.current.setTaskCardSize(4);
    });

    expect(result.current.taskCardSize).toBe(4);
  });

  it("returns all required properties", () => {
    const { result } = renderHook(() => useUI(), { wrapper });

    expect(result.current).toHaveProperty("sidebarWidth");
    expect(result.current).toHaveProperty("setSidebarWidth");
    expect(result.current).toHaveProperty("taskCardSize");
    expect(result.current).toHaveProperty("setTaskCardSize");
  });
});
