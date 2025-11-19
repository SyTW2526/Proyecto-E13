import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import authReducer from "@/store/slices/authSlice";
import themeReducer from "@/store/slices/themeSlice";
import listsReducer from "@/store/slices/listsSlice";
import categoriesReducer from "@/store/slices/categoriesSlice";
import tasksReducer from "@/store/slices/tasksSlice";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
  setAuthToken: vi.fn(),
  apiErrorMessage: (err: unknown) => {
    if (err instanceof Error) return err.message;
    return "Error desconocido";
  },
}));

describe("useAuth", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    store = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
        lists: listsReducer,
        categories: categoriesReducer,
        tasks: tasksReducer,
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <Provider store={store}>{children}</Provider>
    </MemoryRouter>
  );

  it("should return initial auth state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should login successfully", async () => {
    const mockResponse = {
      data: {
        token: "token123",
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
        },
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    const loginResult = await result.current.login(
      "test@example.com",
      "Password123",
    );

    await waitFor(() => {
      expect(loginResult.success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe("token123");
    expect(result.current.user?.email).toBe("test@example.com");
  });

  it("should handle login failure", async () => {
    const error = new Error("Invalid credentials");
    vi.mocked(api.post).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth(), { wrapper });

    const loginResult = await result.current.login(
      "test@example.com",
      "WrongPassword",
    );

    await waitFor(() => {
      expect(loginResult.success).toBe(false);
    });

    expect(loginResult.error).toBeDefined();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should register successfully", async () => {
    const mockRegisterResponse = { data: {} };
    const mockLoginResponse = {
      data: {
        token: "token123",
        user: {
          id: "1",
          email: "new@example.com",
          name: "New User",
        },
      },
    };

    vi.mocked(api.post)
      .mockResolvedValueOnce(mockRegisterResponse)
      .mockResolvedValueOnce(mockLoginResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    const registerResult = await result.current.register(
      "New User",
      "new@example.com",
      "Password123",
    );

    await waitFor(() => {
      expect(registerResult.success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it("should handle register failure", async () => {
    const error = new Error("Invalid credentials");
    vi.mocked(api.post).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth(), { wrapper });

    const registerResult = await result.current.register(
      "New User",
      "new@example.com",
      "Password123",
    );

    await waitFor(() => {
      expect(registerResult.success).toBe(false);
    });

    expect(registerResult.error).toBeDefined();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should login with Google successfully", async () => {
    const mockResponse = {
      data: {
        token: "google-token",
        user: {
          id: "1",
          email: "google@example.com",
          name: "Google User",
        },
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    const googleResult = await result.current.loginWithGoogle("google-id-token");

    await waitFor(() => {
      expect(googleResult.success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it("should handle login with Google failure", async () => {
    const error = new Error("Invalid credentials");
    vi.mocked(api.post).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth(), { wrapper });

    const googleResult = await result.current.loginWithGoogle("google-id-token");

    await waitFor(() => {
      expect(googleResult.success).toBe(false);
    });

    expect(googleResult.error).toBeDefined();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should sign out", async () => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
        lists: listsReducer,
        categories: categoriesReducer,
        tasks: tasksReducer,
      },
      preloadedState: {
        auth: {
          user: { id: "1", email: "test@example.com", name: "Test" },
          token: "token123",
          isAuthenticated: true,
          isLoading: false,
          error: null,
          isInitializing: false,
        },
      },
    });

    const wrapperWithAuth = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperWithAuth,
    });

    result.current.signOut();

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });
  });

  it("should update user profile", async () => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
        lists: listsReducer,
        categories: categoriesReducer,
        tasks: tasksReducer,
      },
      preloadedState: {
        auth: {
          user: { id: "1", email: "test@example.com", name: "Old Name" },
          token: "token123",
          isAuthenticated: true,
          isLoading: false,
          error: null,
          isInitializing: false,
        },
      },
    });

    const wrapperWithAuth = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperWithAuth,
    });

    result.current.updateUserProfile({ name: "New Name" });

    await waitFor(() => {
      expect(result.current.user?.name).toBe("New Name");
    });
  });

  it("should clear auth error", async () => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
        lists: listsReducer,
        categories: categoriesReducer,
        tasks: tasksReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Some error",
          isInitializing: false,
        },
      },
    });

    const wrapperWithError = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperWithError,
    });

    expect(result.current.error).toBe("Some error");

    result.current.clearAuthError();

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});

