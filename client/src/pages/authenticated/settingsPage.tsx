/**
 * @file SettingsPage.tsx
 * @description Página de ajustes donde los usuarios pueden modificar su perfil,
 * preferencias, notificaciones y privacidad.
 */

import {
  Save,
  User,
  Mail,
  KeyRound,
  Bell,
  Palette,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { firstZodIssueMessage } from "@/lib/utils";
import {
  updateNameSchema,
  changePasswordSchema,
} from "@/schemas/validationSchemas";
import { api, apiErrorMessage } from "@/lib/api";

export default function SettingsPage() {
  const { user, updateUserProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [nameProfileMsg, setNameProfileMsg] = useState<string | null>(null);
  const [name, setName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notificationsMsg, setNotificationsMsg] = useState<string | null>(null);
  const [deleteAccountMsg, setDeleteAccountMsg] = useState<string | null>(null);

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const passwordHelperText = user?.isGoogleAuthUser
    ? "Los usuarios que acceden con Google no pueden cambiar su contraseña desde la aplicación."
    : passwordMsg;

  // Actualizar nombre
  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const validation = updateNameSchema.safeParse({ name });
    if (!validation.success) {
      const errorMsg = firstZodIssueMessage(validation.error);
      setNameProfileMsg(errorMsg);
      return;
    }
    try {
      await api.put("/users/me/name", { name: validation.data.name });
      updateUserProfile({ name: validation.data.name });
      setNameProfileMsg("Nombre actualizado correctamente.");
    } catch (err: unknown) {
      const errorMsg = apiErrorMessage(err);
      setNameProfileMsg(errorMsg);
    }
  }

  // Cambiar contraseña
  async function onSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (user?.isGoogleAuthUser) {
      setPasswordMsg(
        "Los usuarios que acceden con Google no pueden cambiar su contraseña desde la aplicación.",
      );
      return;
    }
    const validation = changePasswordSchema.safeParse({
      currentPassword: currentPassword,
      newPassword: newPassword,
    });
    if (!validation.success) {
      const errorMsg = firstZodIssueMessage(validation.error);
      setPasswordMsg(errorMsg);
      return;
    }
    try {
      await api.put("/auth/password", {
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      setPasswordMsg("Contraseña actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      const errorMsg = apiErrorMessage(err);
      setPasswordMsg(errorMsg);
    }
  }

  // Cambiar tema (oscuro/claro)
  function handleToggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  // Notificaciones: email
  async function handleToggleEmail() {
    const previous = user?.emailNotifications ?? false;
    const newValue = !previous;
    updateUserProfile({ emailNotifications: newValue });
    try {
      await api.put("/users/me/email-notifications", {
        emailNotifications: newValue,
      });
      setNotificationsMsg(
        `Notificaciones por correo ${newValue ? "activadas" : "desactivadas"}.`,
      );
    } catch (err: unknown) {
      const errorMsg = apiErrorMessage(err);
      setNotificationsMsg(errorMsg);
    }
  }

  // Notificaciones: push
  async function handleTogglePush() {
    const previous = user?.pushNotifications ?? false;
    const newValue = !previous;
    updateUserProfile({ pushNotifications: newValue });
    try {
      await api.put("/users/me/push-notifications", {
        pushNotifications: newValue,
      });
      setNotificationsMsg(
        `Notificaciones push ${newValue ? "activadas" : "desactivadas"}.`,
      );
    } catch (err: unknown) {
      const errorMsg = apiErrorMessage(err);
      setNotificationsMsg(errorMsg);
    }
  }

  // Eliminar cuenta
  async function handleDeleteAccount() {
    const confirmDelete = window.confirm(
      "Esta acción es irreversible. ¿Seguro que quieres eliminar tu cuenta?",
    );
    if (!confirmDelete) {
      setDeleteAccountMsg("Eliminación de cuenta cancelada.");
      return;
    }
    try {
      await api.delete("/users/me");
      signOut();
      setDeleteAccountMsg("Cuenta eliminada correctamente.");
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const errorMsg = apiErrorMessage(err);
      setDeleteAccountMsg(errorMsg);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Ajustes</h1>
        <p className="text-sm text-muted-foreground">
          Preferencias de cuenta, notificaciones y privacidad.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Perfil
          </CardTitle>
          <CardDescription>Actualiza tu nombre y contraseña.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Nombre y email */}
          <form onSubmit={onSaveProfile} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Introduce tu nombre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || "No disponible"}
                disabled
                readOnly
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-4 pt-2">
              <div className="text-sm text-muted-foreground">
                {nameProfileMsg}
              </div>
              <Button type="submit" className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar cambios
              </Button>
            </div>
          </form>

          <Separator />

          {/* Contraseña */}
          <form onSubmit={onSavePassword} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="curr">Contraseña actual</Label>
              <Input
                id="curr"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={user?.isGoogleAuthUser}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new" className="inline-flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> Nueva contraseña
              </Label>
              <Input
                id="new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={user?.isGoogleAuthUser}
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-4 pt-2">
              <div className="text-sm text-muted-foreground">
                {passwordHelperText}
              </div>
              <Button
                type="submit"
                disabled={user?.isGoogleAuthUser}
                className="inline-flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* PREFERENCIAS: tema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" /> Preferencias
          </CardTitle>
          <CardDescription>Tema y experiencia de uso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Tema oscuro</div>
              <div className="text-sm text-muted-foreground">
                Activa el modo oscuro para una experiencia visual más cómoda
                en entornos con poca luz.
              </div>
            </div>
            <Switch checked={isDark} onCheckedChange={handleToggleTheme} />
          </div>
        </CardContent>
      </Card>

      {/* NOTIFICACIONES: persistentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notificaciones
          </CardTitle>
          <CardDescription>Configura cómo recibir avisos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Correo electrónico</div>
              <div className="text-sm text-muted-foreground">
                Recibe correos electrónicos con la información acerca de tus tareas.
              </div>
            </div>
            <Switch
              checked={user?.emailNotifications}
              onCheckedChange={handleToggleEmail}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Notificaciones push</div>
              <div className="text-sm text-muted-foreground">
                Recibe notificaciones emergentes en tiempo real cuando alguien
                te comparta una tarea o alguna tarea esté por vencer.
              </div>
            </div>
            <Switch
              checked={user?.pushNotifications}
              onCheckedChange={handleTogglePush}
            />
          </div>
          {notificationsMsg && (
            <div className="text-sm text-muted-foreground">
              {notificationsMsg}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> Privacidad
          </CardTitle>
          <CardDescription>
            Elimina tu cuenta de forma irreversible.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {deleteAccountMsg && (
            <div className="text-sm text-muted-foreground">
              {deleteAccountMsg}
            </div>
          )}
          <Button
            variant="destructive"
            className="inline-flex items-center gap-2"
            onClick={handleDeleteAccount}
          >
            <Trash2 className="h-4 w-4" />
            Eliminar cuenta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
