import { describe, it, expect, beforeEach, vi } from "vitest";
import authReducer, {
  loginUser,
  registerUser,
  loginWithGoogleUser,
  logout,
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount,
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
  api: {
    post: vi.fn(),
  },
  apiErrorMessage: vi.fn(),
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

    // Login Thunk
    it("should handle loginUser.pending", () => {
      const action = { type: loginUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle loginUser.fulfilled", () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: { user: mockUser, token: "token123" },
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe("token123");
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should handle loginUser.rejected", () => {
      const action = {
        type: loginUser.rejected.type,
        payload: "Invalid credentials",
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Invalid credentials");
      expect(state.isAuthenticated).toBe(false);
    });

    // Register Thunk
    it("should handle registerUser.pending", () => {
      const action = { type: registerUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle registerUser.fulfilled", () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: { user: mockUser, token: "token123" },
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe("token123");
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should handle registerUser.rejected", () => {
      const action = {
        type: registerUser.rejected.type,
        payload: "Registration failed",
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Registration failed");
      expect(state.isAuthenticated).toBe(false);
    });

    // Google Login Thunk
    it("should handle loginWithGoogleUser.pending", () => {
      const action = { type: loginWithGoogleUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle loginWithGoogleUser.fulfilled", () => {
      const action = {
        type: loginWithGoogleUser.fulfilled.type,
        payload: { user: mockUser, token: "token123" },
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe("token123");
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should handle loginWithGoogleUser.rejected", () => {
      const action = {
        type: loginWithGoogleUser.rejected.type,
        payload: "Google login failed",
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Google login failed");
      expect(state.isAuthenticated).toBe(false);
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
    });

    // Update Profile Thunk
    it("should handle updateUserProfile.fulfilled", () => {
      const loggedInState: AuthState = {
        ...initialState,
        user: mockUser,
        token: "token123",
        isAuthenticated: true,
      };

      const action = {
        type: updateUserProfile.fulfilled.type,
        payload: { name: "Updated Name" },
      };
      const state = authReducer(loggedInState, action);

      expect(state.user?.name).toBe("Updated Name");
      expect(state.user?.email).toBe(mockUser.email);
    });

    // Change Password Thunk
    it("should handle changeUserPassword.fulfilled", () => {
      const action = { type: changeUserPassword.fulfilled.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
    });

    // Delete Account Thunk
    it("should handle deleteUserAccount.fulfilled", () => {
      const loggedInState: AuthState = {
        ...initialState,
        user: mockUser,
        token: "token123",
        isAuthenticated: true,
      };

      const action = { type: deleteUserAccount.fulfilled.type };
      const state = authReducer(loggedInState, action);

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
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
