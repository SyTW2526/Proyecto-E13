/**
 * @file SettingsPage.tsx
 * @description Página de ajustes donde los usuarios pueden modificar su perfil,
 * preferencias, notificaciones y privacidad.
 */
import { useState } from "react";
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

import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  selectUser,
  updateUser,
  logout,
} from "@/store/slices/authSlice";
import { selectIsDark, toggleTheme } from "@/store/slices/themeSlice";

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
import { api, apiErrorMessage } from "@/lib/api";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isDark = useAppSelector(selectIsDark);

  // Perfil
  const [name, setName] = useState(user?.name || "");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Contraseña
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  // Notificaciones
  const [notifEmail, setNotifEmail] = useState(
    user?.emailNotifications ?? false,
  );
  const [notifPush, setNotifPush] = useState(
    user?.pushNotifications ?? false,
  );
  const [notifMsg, setNotifMsg] = useState<string | null>(null);

  // Privacidad
  const [privacyMsg, setPrivacyMsg] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Perfil: actualizar nombre
  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setProfileMsg("El nombre no puede estar vacío.");
      return;
    }

    try {
      setSavingProfile(true);
      setProfileMsg(null);

      await api.put("/users/me/name", { name });

      // Actualizo el usuario en el store
      dispatch(updateUser({ name }));

      setProfileMsg("Nombre actualizado correctamente.");
    } catch (err: unknown) {
      setProfileMsg(apiErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  }

  // ----------------------------------------
  // Contraseña: cambiar contraseña
  // ----------------------------------------
  async function onSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currPass || !newPass) {
      setPasswordMsg("Debes rellenar la contraseña actual y la nueva.");
      return;
    }

    try {
      setSavingPassword(true);
      setPasswordMsg(null);

      await api.put("/auth/password", {
        currentPassword: currPass,
        newPassword: newPass,
      });

      setCurrPass("");
      setNewPass("");
      setPasswordMsg("Contraseña actualizada correctamente.");
    } catch (err: unknown) {
      setPasswordMsg(apiErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  }

  // ----------------------------------------
  // Preferencias: tema
  // ----------------------------------------
  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  // ----------------------------------------
  // Notificaciones: email
  // ----------------------------------------
  async function handleToggleEmail(checked: boolean) {
    const previous = notifEmail;
    setNotifEmail(checked);
    setNotifMsg(null);

    try {
      await api.put("/users/me/email-notifications", {
        emailNotifications: checked,
      });

      dispatch(updateUser({ emailNotifications: checked }));
      setNotifMsg("Preferencias de correo actualizadas.");
    } catch (err: unknown) {
      // Revertir en caso de error
      setNotifEmail(previous);
      setNotifMsg(apiErrorMessage(err));
    }
  }

  // ----------------------------------------
  // Notificaciones: push
  // ----------------------------------------
  async function handleTogglePush(checked: boolean) {
    const previous = notifPush;
    setNotifPush(checked);
    setNotifMsg(null);

    try {
      await api.put("/users/me/push-notifications", {
        pushNotifications: checked,
      });

      dispatch(updateUser({ pushNotifications: checked }));
      setNotifMsg("Preferencias de notificaciones push actualizadas.");
    } catch (err: unknown) {
      setNotifPush(previous);
      setNotifMsg(apiErrorMessage(err));
    }
  }

  // ----------------------------------------
  // Privacidad: eliminar cuenta
  // ----------------------------------------
  async function handleDeleteAccount() {
    const confirmDelete = window.confirm(
      "Esta acción es irreversible. ¿Seguro que quieres eliminar tu cuenta?",
    );
    if (!confirmDelete) return;

    try {
      setDeletingAccount(true);
      setPrivacyMsg(null);

      await api.delete("/users/me");

      // Logout local y redirección básica
      dispatch(logout());
      setPrivacyMsg("Cuenta eliminada correctamente.");
      window.location.href = "/";
    } catch (err: unknown) {
      setPrivacyMsg(apiErrorMessage(err));
    } finally {
      setDeletingAccount(false);
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

      {/* PERFIL: nombre (formulario 1) + contraseña (formulario 2) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Perfil
          </CardTitle>
          <CardDescription>
            Actualiza tu nombre y correo. El correo puede estar bloqueado por el
            sistema.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Formulario 1: sólo nombre */}
          <form
            onSubmit={onSaveProfile}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
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
                {profileMsg}
              </div>
              <Button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Guardar cambios
              </Button>
            </div>
          </form>

          <Separator />

          {/* Formulario 2: contraseña independiente */}
          <form
            onSubmit={onSavePassword}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="space-y-2">
              <Label htmlFor="curr">Contraseña actual</Label>
              <Input
                id="curr"
                type="password"
                value={currPass}
                onChange={(e) => setCurrPass(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new" className="inline-flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> Nueva contraseña
              </Label>
              <Input
                id="new"
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-4 pt-2">
              <div className="text-sm text-muted-foreground">
                {passwordMsg}
              </div>
              <Button
                type="submit"
                disabled={savingPassword}
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
                Activa el modo oscuro en la interfaz.
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
                Resumen diario de actividad.
              </div>
            </div>
            <Switch
              checked={notifEmail}
              onCheckedChange={handleToggleEmail}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Notificaciones push</div>
              <div className="text-sm text-muted-foreground">
                Avisos en tiempo real del navegador.
              </div>
            </div>
            <Switch
              checked={notifPush}
              onCheckedChange={handleTogglePush}
            />
          </div>
          {notifMsg && (
            <div className="text-sm text-muted-foreground">{notifMsg}</div>
          )}
        </CardContent>
      </Card>

      {/* PRIVACIDAD: sin botón de exportar, sólo eliminar cuenta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> Privacidad
          </CardTitle>
          <CardDescription>
            Controla el tratamiento de tus datos y la eliminación de la cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {privacyMsg && (
            <div className="text-sm text-muted-foreground">{privacyMsg}</div>
          )}
          <Button
            variant="destructive"
            className="inline-flex items-center gap-2"
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
          >
            <Trash2 className="h-4 w-4" />
            Eliminar cuenta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
