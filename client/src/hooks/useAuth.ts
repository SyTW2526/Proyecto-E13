import { useCallback } from "react";
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

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(loginRequest());
      try {
        const { data } = await api.post<{
          token: string;
          user: {
            id: string;
            email: string;
            name: string;
            image?: string;
            emailNotifications?: boolean;
            pushNotifications?: boolean;
            isGoogleAuthUser?: boolean;
          };
        }>("/auth/login", { email, password });

        dispatch(
          loginSuccess({
            user: data.user,
            token: data.token,
          }),
        );
        return { success: true };
      } catch (err) {
        const errorMsg = apiErrorMessage(err);
        dispatch(loginFailure(errorMsg));
        return { success: false, error: errorMsg };
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
          user: {
            id: string;
            email: string;
            name: string;
            image?: string;
            emailNotifications?: boolean;
            pushNotifications?: boolean;
            isGoogleAuthUser?: boolean;
          };
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
    },
    [dispatch],
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      dispatch(loginRequest());
      try {
        const { data } = await api.post<{
          token: string;
          user: {
            id: string;
            email: string;
            name: string;
            image?: string;
            emailNotifications?: boolean;
            pushNotifications?: boolean;
            isGoogleAuthUser?: boolean;
          };
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
