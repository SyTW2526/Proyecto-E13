import { describe, it, expect, beforeEach, vi } from "vitest";
import authReducer, {
  loginSuccess,
  loginRequest,
  loginFailure,
  logout,
  updateUser,
  clearError,
  selectUser,
  selectIsAuthenticated,
  selectToken,
  selectAuthLoading,
  selectAuthError,
} from "@/store/slices/authSlice";
import { setAuthToken } from "@/lib/api";
import type { AuthState } from "@/types/auth/auth";
import type { User } from "@/types/auth/auth";

vi.mock("@/lib/api", () => ({
  setAuthToken: vi.fn(),
}));

describe("authSlice", () => {
  let initialState: AuthState;
  const mockUser: User = {
    id: "1",
    email: "test@example.com",
    name: "Test User",
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitializing: false,
    };
  });

  describe("reducer", () => {
    it("should return initial state", () => {
      expect(authReducer(undefined, { type: "unknown" })).toMatchObject({
        isAuthenticated: expect.any(Boolean),
        isLoading: false,
        error: null,
      });
    });

    it("should handle loginRequest action", () => {
      const action = loginRequest();
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle loginSuccess action", () => {
      const action = loginSuccess({ user: mockUser, token: "token123" });
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe("token123");
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(setAuthToken).toHaveBeenCalledWith("token123");
      expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
    });

    it("should handle loginFailure action", () => {
      const action = loginFailure("Invalid credentials");
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Invalid credentials");
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });

    it("should handle logout action", () => {
      const loggedInState: AuthState = {
        ...initialState,
        user: mockUser,
        token: "token123",
        isAuthenticated: true,
      };
      localStorage.setItem("user", JSON.stringify(mockUser));

      const action = logout();
      const state = authReducer(loggedInState, action);

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(setAuthToken).toHaveBeenCalled();
      expect(localStorage.getItem("user")).toBeNull();
    });

    it("should handle updateUser action", () => {
      const loggedInState: AuthState = {
        ...initialState,
        user: mockUser,
        token: "token123",
        isAuthenticated: true,
      };

      const action = updateUser({ name: "Updated Name" });
      const state = authReducer(loggedInState, action);

      expect(state.user?.name).toBe("Updated Name");
      expect(state.user?.email).toBe(mockUser.email);
      expect(state.user?.id).toBe(mockUser.id);
      expect(localStorage.getItem("user")).toBe(
        JSON.stringify({ ...mockUser, name: "Updated Name" }),
      );
    });

    it("should handle updateUser when user is null", () => {
      const action = updateUser({ name: "New Name" });
      const state = authReducer(initialState, action);

      expect(state.user).toBeNull();
    });

    it("should handle clearError action", () => {
      const errorState: AuthState = {
        ...initialState,
        error: "Some error",
      };

      const action = clearError();
      const state = authReducer(errorState, action);

      expect(state.error).toBeNull();
    });
  });

  describe("selectors", () => {
    it("selectUser should return user", () => {
      const state = { auth: { ...initialState, user: mockUser } };
      expect(selectUser(state as any)).toEqual(mockUser);
    });

    it("selectIsAuthenticated should return authentication status", () => {
      const state = { auth: { ...initialState, isAuthenticated: true } };
      expect(selectIsAuthenticated(state as any)).toBe(true);
    });

    it("selectToken should return token", () => {
      const state = { auth: { ...initialState, token: "token123" } };
      expect(selectToken(state as any)).toBe("token123");
    });

    it("selectAuthLoading should return loading status", () => {
      const state = { auth: { ...initialState, isLoading: true } };
      expect(selectAuthLoading(state as any)).toBe(true);
    });

    it("selectAuthError should return error", () => {
      const state = { auth: { ...initialState, error: "Error message" } };
      expect(selectAuthError(state as any)).toBe("Error message");
    });
  });
});
