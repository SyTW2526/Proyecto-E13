import { useSettings } from "@/hooks/useSettings";
import authReducer from "@/store/slices/authSlice";
import listsReducer from "@/store/slices/listsSlice";
import tasksReducer from "@/store/slices/tasksSlice";
import themeReducer from "@/store/slices/themeSlice";
import notificationsReducer from "@/store/slices/notificationsSlice";
import uiReducer from "@/store/slices/uiSlice";
import { configureStore } from "@reduxjs/toolkit";
import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn(),
  },
  apiErrorMessage: (err: unknown) => {
    if (err instanceof Error) return err.message;
    return "Error desconocido";
  },
}));

describe("useSettings", () => {
  let store: ReturnType<typeof configureStore>;

  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    isGoogleAuthUser: false,
    emailNotifications: true,
    pushNotifications: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    store = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
        lists: listsReducer,
        tasks: tasksReducer,
        notifications: notificationsReducer,
        ui: uiReducer,
      },
      preloadedState: {
        auth: {
          user: mockUser,
          token: "token123",
          isAuthenticated: true,
          isLoading: false,
          error: null,
          isInitializing: false,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <Provider store={store}>{children}</Provider>
    </MemoryRouter>
  );

  it("returns initial state from user", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.name).toBe("Test User");
    expect(result.current.email).toBe("test@example.com");
    expect(result.current.isGoogleUser).toBe(false);
    expect(result.current.emailNotifications).toBe(true);
    expect(result.current.pushNotifications).toBe(false);
  });

  it("setName updates the name state", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.setName("New Name");
    });

    expect(result.current.name).toBe("New Name");
  });

  it("setCurrPass updates current password state", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.setCurrPass("oldpassword");
    });

    expect(result.current.currPass).toBe("oldpassword");
  });

  it("setNewPass updates new password state", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.setNewPass("newpassword123");
    });

    expect(result.current.newPass).toBe("newpassword123");
  });

  it("provides saveProfile function", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(typeof result.current.saveProfile).toBe("function");
  });

  it("provides savePassword function", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(typeof result.current.savePassword).toBe("function");
  });

  it("provides toggleEmailNotifications function", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(typeof result.current.toggleEmailNotifications).toBe("function");
  });

  it("provides togglePushNotifications function", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(typeof result.current.togglePushNotifications).toBe("function");
  });

  it("provides deleteAccount function", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(typeof result.current.deleteAccount).toBe("function");
  });

  it("savingProfile is initially false", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.savingProfile).toBe(false);
  });

  it("savingPassword is initially false", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.savingPassword).toBe(false);
  });

  it("profileMsg is initially null", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.profileMsg).toBeNull();
  });

  it("passwordMsg is initially null", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.passwordMsg).toBeNull();
  });

  it("notifMsg is initially null", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.notifMsg).toBeNull();
  });

  it("deleteAccountMsg is initially null", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.deleteAccountMsg).toBeNull();
  });

  it("saveProfile validates empty name", async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.setName("");
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.saveProfile(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.profileMsg).not.toBeNull();
    });
  });

  it("savePassword blocks Google users", async () => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
        lists: listsReducer,
        tasks: tasksReducer,
        notifications: notificationsReducer,
        ui: uiReducer,
      },
      preloadedState: {
        auth: {
          user: { ...mockUser, isGoogleAuthUser: true },
          token: "token123",
          isAuthenticated: true,
          isLoading: false,
          error: null,
          isInitializing: false,
        },
      },
    });

    const { result } = renderHook(() => useSettings(), { wrapper });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.savePassword(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.passwordMsg).toContain("Google");
    });
  });

  it("savePassword validates empty passwords", async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.savePassword(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.passwordMsg).not.toBeNull();
    });
  });

  it("handles successful saveProfile", async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.setName("Valid Name");
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.saveProfile(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.savingProfile).toBe(false);
    });
  });

  it("handles toggleEmailNotifications", async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    await act(async () => {
      await result.current.toggleEmailNotifications();
    });

    await waitFor(() => {
      expect(result.current.notifMsg).toBeDefined();
    });
  });

  it("handles togglePushNotifications", async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    await act(async () => {
      await result.current.togglePushNotifications();
    });

    await waitFor(() => {
      expect(result.current.notifMsg).toBeDefined();
    });
  });

  it("handles null user gracefully", () => {
    const nullUserStore = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
        lists: listsReducer,
        tasks: tasksReducer,
        notifications: notificationsReducer,
        ui: uiReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isInitializing: false,
        },
      },
    });

    const nullWrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <Provider store={nullUserStore}>{children}</Provider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useSettings(), {
      wrapper: nullWrapper,
    });

    expect(result.current.name).toBe("");
    expect(result.current.email).toBeUndefined();
    expect(result.current.emailNotifications).toBe(false);
    expect(result.current.pushNotifications).toBe(false);
  });
});
