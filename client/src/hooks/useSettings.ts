import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { api, apiErrorMessage } from "@/lib/api";
import {
  updateNameSchema,
  changePasswordSchema,
} from "@/schemas/validationSchemas";
import { firstZodIssueMessage } from "@/lib/utils";

interface UseSettingsReturn {
  // Nombre
  name: string;
  updateName: (newName: string) => void;
  saveProfile: () => Promise<{ success: boolean; error?: string }>;
  profileMsg: string | null;
  savingProfile: boolean;

  // Contraseña
  currPass: string;
  setCurrPass: (pass: string) => void;
  newPass: string;
  setNewPass: (pass: string) => void;
  savePassword: () => Promise<{ success: boolean; error?: string }>;
  passwordMsg: string | null;
  savingPassword: boolean;
  isGoogleAuthUser: boolean;

  // Notificaciones
  emailNotifications: boolean;
  pushNotifications: boolean;
  toggleEmailNotifications: () => Promise<{ success: boolean; error?: string }>;
  togglePushNotifications: () => Promise<{ success: boolean; error?: string }>;
  notifMsg: string | null;

  // Eliminar cuenta
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  deleteAccountMsg: string | null;
  deletingAccount: boolean;
}

export function useSettings(): UseSettingsReturn {
  const navigate = useNavigate();
  const { user, updateUserProfile, signOut } = useAuth();

  // Nombre
  const [name, setName] = useState(user?.name || "");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Contraseña
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  // Notificaciones
  const [notifMsg, setNotifMsg] = useState<string | null>(null);

  // Eliminar cuenta
  const [deleteAccountMsg, setDeleteAccountMsg] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Sincronizar nombre cuando el usuario cambia
  useEffect(() => {
    if (user?.name && user.name !== name) {
      setName(user.name);
    }
  }, [user?.name, name]);

  const updateName = useCallback((newName: string) => {
    setName(newName);
  }, []);

  const saveProfile = useCallback(async () => {
    setProfileMsg(null);

    const validation = updateNameSchema.safeParse({ name });
    if (!validation.success) {
      const errorMsg = firstZodIssueMessage(validation.error);
      setProfileMsg(errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      setSavingProfile(true);

      await api.put("/users/me/name", { name: validation.data.name });

      updateUserProfile({ name: validation.data.name });
      setProfileMsg("Nombre actualizado correctamente.");
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = apiErrorMessage(err);
      setProfileMsg(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSavingProfile(false);
    }
  }, [name, updateUserProfile]);

  const savePassword = useCallback(async () => {
    setPasswordMsg(null);

    const validation = changePasswordSchema.safeParse({
      currentPassword: currPass,
      newPassword: newPass,
    });
    if (!validation.success) {
      const errorMsg = firstZodIssueMessage(validation.error);
      setPasswordMsg(errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      setSavingPassword(true);

      await api.put("/auth/password", {
        currentPassword: validation.data.currentPassword,
        newPassword: validation.data.newPassword,
      });

      setCurrPass("");
      setNewPass("");
      setPasswordMsg("Contraseña actualizada correctamente.");
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = apiErrorMessage(err);
      setPasswordMsg(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSavingPassword(false);
    }
  }, [currPass, newPass]);

  const toggleEmailNotifications = useCallback(async () => {
    const previous = user?.emailNotifications ?? false;
    const newValue = !previous;
    setNotifMsg(null);

    updateUserProfile({ emailNotifications: newValue });

    try {
      await api.put("/users/me/email-notifications", {
        emailNotifications: newValue,
      });

      setNotifMsg("Preferencias de correo actualizadas.");
      return { success: true };
    } catch (err: unknown) {
      updateUserProfile({ emailNotifications: previous });
      const errorMsg = apiErrorMessage(err);
      setNotifMsg(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [user?.emailNotifications, updateUserProfile]);

  const togglePushNotifications = useCallback(async () => {
    const previous = user?.pushNotifications ?? false;
    const newValue = !previous;
    setNotifMsg(null);

    updateUserProfile({ pushNotifications: newValue });

    try {
      await api.put("/users/me/push-notifications", {
        pushNotifications: newValue,
      });

      setNotifMsg("Preferencias de notificaciones push actualizadas.");
      return { success: true };
    } catch (err: unknown) {
      updateUserProfile({ pushNotifications: previous });
      const errorMsg = apiErrorMessage(err);
      setNotifMsg(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [user?.pushNotifications, updateUserProfile]);

  const deleteAccount = useCallback(async () => {
    const confirmDelete = window.confirm(
      "Esta acción es irreversible. ¿Seguro que quieres eliminar tu cuenta?",
    );
    if (!confirmDelete) {
      return { success: false, error: "Operación cancelada" };
    }

    try {
      setDeletingAccount(true);
      setDeleteAccountMsg(null);

      await api.delete("/users/me");

      signOut();
      setDeleteAccountMsg("Cuenta eliminada correctamente.");
      navigate("/", { replace: true });
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = apiErrorMessage(err);
      setDeleteAccountMsg(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setDeletingAccount(false);
    }
  }, [signOut, navigate]);

  return {
    // Nombre
    name,
    updateName,
    saveProfile,
    profileMsg,
    savingProfile,

    // Contraseña
    currPass,
    setCurrPass,
    newPass,
    setNewPass,
    savePassword,
    passwordMsg,
    savingPassword,
    isGoogleAuthUser: user?.isGoogleAuthUser ?? false,

    // Notificaciones
    emailNotifications: user?.emailNotifications ?? false,
    pushNotifications: user?.pushNotifications ?? false,
    toggleEmailNotifications,
    togglePushNotifications,
    notifMsg,

    // Eliminar cuenta
    deleteAccount,
    deleteAccountMsg,
    deletingAccount,
  };
}
