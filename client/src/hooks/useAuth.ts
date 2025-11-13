import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  loginRequest,
  loginSuccess,
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
import { api, apiErrorMessage } from "@/lib/api";
import type { User } from "@/types/auth/auth";

export function useAuth() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = useAppSelector(selectToken);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = async (email: string, password: string) => {
    dispatch(loginRequest());
    try {
      const { data } = await api.post<{
        token: string;
        user: { id: string; email: string; name: string; avatar?: string };
      }>("/auth/login", { email, password });

      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        }),
      );
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = apiErrorMessage(err);
      dispatch(loginFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch(loginRequest());
    try {
      await api.post("/auth/register", { name, email, password });
      const { data } = await api.post<{
        token: string;
        user: { id: string; email: string; name: string; avatar?: string };
      }>("/auth/login", { email, password });

      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        }),
      );
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = apiErrorMessage(err);
      dispatch(loginFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    dispatch(loginRequest());
    try {
      const { data } = await api.post<{
        token: string;
        user: { id: string; email: string; name: string; avatar?: string };
      }>("/auth/google", { idToken });

      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        }),
      );
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = apiErrorMessage(err);
      dispatch(loginFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  };

  const signOut = () => {
    dispatch(logout());
  };

  const updateUserProfile = (updates: Partial<User>) => {
    dispatch(updateUser(updates));
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    token,
    isLoading,
    error,
    login,
    register,
    loginWithGoogle,
    signOut,
    updateUserProfile,
    clearAuthError,
  };
}
