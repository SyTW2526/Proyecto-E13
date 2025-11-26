import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { api, apiErrorMessage } from "@/lib/api";
import {
  updateNameSchema,
  changePasswordSchema,
} from "@/schemas/validationSchemas";
import { firstZodIssueMessage } from "@/lib/utils";

export function useSettings() {
  const navigate = useNavigate();
  const { user, updateUserProfile, signOut } = useAuth();
  
  const [name, setName] = useState(user?.name || "");
  const email = user?.email;
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);
  const [notifMsg, setNotifMsg] = useState<string | null>(null);
  const [deleteAccountMsg, setDeleteAccountMsg] = useState<string | null>(null);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    const validation = updateNameSchema.safeParse({ name });
    if (!validation.success) {
      setProfileMsg(firstZodIssueMessage(validation.error));
      return;
    }

    try {
      setSavingProfile(true);
      await api.patch("/users/me", { name: validation.data.name });
      updateUserProfile({ name: validation.data.name });
      setProfileMsg("Nombre actualizado correctamente.");
    } catch (err) {
      setProfileMsg(apiErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (user?.isGoogleAuthUser) {
      setPasswordMsg(
        "Los usuarios de Google no pueden cambiar contraseña aquí.",
      );
      return;
    }

    const validation = changePasswordSchema.safeParse({
      currentPassword: currPass,
      newPassword: newPass,
    });
    if (!validation.success) {
      setPasswordMsg(firstZodIssueMessage(validation.error));
      return;
    }

    try {
      setSavingPassword(true);
      await api.put("/auth/password", validation.data);
      setPasswordMsg("Contraseña actualizada correctamente.");
      setCurrPass("");
      setNewPass("");
    } catch (err) {
      setPasswordMsg(apiErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  };

  const toggleEmailNotifications = async () => {
    const newValue = !user?.emailNotifications;
    setNotifMsg(null);
    updateUserProfile({ emailNotifications: newValue }); // Optimistic update

    try {
      await api.patch("/users/me", { emailNotifications: newValue });
      setNotifMsg(
        `Notificaciones por correo ${newValue ? "activadas" : "desactivadas"}.`,
      );
    } catch (err) {
      updateUserProfile({ emailNotifications: !newValue }); // Rollback
      setNotifMsg(apiErrorMessage(err));
    }
  };

  const togglePushNotifications = async () => {
    const newValue = !user?.pushNotifications;
    setNotifMsg(null);
    updateUserProfile({ pushNotifications: newValue }); // Optimistic update

    try {
      await api.patch("/users/me", { pushNotifications: newValue });
      setNotifMsg(
        `Notificaciones push ${newValue ? "activadas" : "desactivadas"}.`,
      );
    } catch (err) {
      updateUserProfile({ pushNotifications: !newValue }); // Rollback
      setNotifMsg(apiErrorMessage(err));
    }
  };

  const deleteAccount = async () => {
    if (
      !window.confirm(
        "Esta acción es irreversible. ¿Seguro que quieres eliminar tu cuenta?",
      )
    ) {
      return;
    }

    try {
      setDeleteAccountMsg(null);
      await api.delete("/users/me");
      signOut();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteAccountMsg(apiErrorMessage(err));
    }
  };

  return {
    name,
    setName,
    email,
    saveProfile,
    profileMsg,
    savingProfile,
    currPass,
    setCurrPass,
    newPass,
    setNewPass,
    savePassword,
    passwordMsg,
    savingPassword,
    isGoogleUser: user?.isGoogleAuthUser,
    emailNotifications: user?.emailNotifications ?? false,
    pushNotifications: user?.pushNotifications ?? false,
    toggleEmailNotifications,
    togglePushNotifications,
    notifMsg,
    deleteAccount,
    deleteAccountMsg,
  };
}
