import { api, apiErrorMessage, getValidationErrors } from "@/lib/api";
import {
  clearError,
  loginFailure,
  loginRequest,
  loginSuccess,
  logout,
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  selectToken,
  selectUser,
  updateUser,
} from "@/store/slices/authSlice";
import type { User } from "@/types/auth/auth";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";

export function useAuth() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = useAppSelector(selectToken);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = useCallback(
    async (email: string, password: string) => {
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
        const validationErrors = getValidationErrors(err);
        dispatch(loginFailure(errorMsg));
        return {
          success: false,
          error: errorMsg,
          validationErrors: validationErrors ?? undefined,
        };
      }
    },
    [dispatch],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
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
        const validationErrors = getValidationErrors(err);
        dispatch(loginFailure(errorMsg));
        return {
          success: false,
          error: errorMsg,
          validationErrors: validationErrors ?? undefined,
        };
      }
    },
    [dispatch],
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
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
    },
    [dispatch],
  );

  const signOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const updateUserProfile = useCallback(
    (updates: Partial<User>) => {
      dispatch(updateUser(updates));
    },
    [dispatch],
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

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
