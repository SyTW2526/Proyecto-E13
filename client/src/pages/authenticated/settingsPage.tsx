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
import { useSettings } from "@/hooks/useSettings";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUI } from "@/hooks/useUI";
import { SidebarWidth, TaskCardSize } from "@/store/slices/uiSlice";

export default function SettingsPage() {
  const {
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
    isGoogleUser,
    emailNotifications,
    pushNotifications,
    toggleEmailNotifications,
    togglePushNotifications,
    notifMsg,
    deleteAccount,
    deleteAccountMsg,
  } = useSettings();

  const { sidebarWidth, setSidebarWidth, taskCardSize, setTaskCardSize } =
    useUI();

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const passwordHelperText = isGoogleUser
    ? "Los usuarios que acceden con Google no pueden cambiar su contraseña desde la aplicación."
    : passwordMsg;

  // Cambiar tema (oscuro/claro)
  function handleToggleTheme() {
    setTheme(isDark ? "light" : "dark");
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
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Introduce tu nombre"
                disabled={savingProfile}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </Label>
              <Input id="email" type="email" value={email} disabled readOnly />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-4 pt-2">
              <div className="text-sm text-muted-foreground">{profileMsg}</div>
              <Button
                type="submit"
                className="inline-flex items-center gap-2"
                disabled={savingProfile}
              >
                <Save className="h-4 w-4" />
                {savingProfile ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>

          <Separator />

          {/* Contraseña */}
          <form onSubmit={savePassword} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="curr">Contraseña actual</Label>
              <Input
                id="curr"
                type="password"
                value={currPass}
                onChange={(e) => setCurrPass(e.target.value)}
                disabled={isGoogleUser || savingPassword}
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
                disabled={isGoogleUser || savingPassword}
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-4 pt-2">
              <div className="text-sm text-muted-foreground">
                {passwordHelperText}
              </div>
              <Button
                type="submit"
                disabled={isGoogleUser || savingPassword}
                className="inline-flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {savingPassword ? "Guardando..." : "Guardar cambios"}
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
                Activa el modo oscuro para una experiencia visual más cómoda en
                entornos con poca luz.
              </div>
            </div>
            <Switch checked={isDark} onCheckedChange={handleToggleTheme} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Tamaño de la barra lateral</div>
              <div className="text-sm text-muted-foreground">
                Ajusta el ancho de la lista de tareas.
              </div>
            </div>
            <Select
              value={sidebarWidth}
              onValueChange={(value) => setSidebarWidth(value as SidebarWidth)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona un tamaño" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compacto</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="wide">Amplio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Tamaño de las tarjetas</div>
              <div className="text-sm text-muted-foreground">
                Ajusta el tamaño de las tarjetas de tarea.
              </div>
            </div>
            <Select
              value={taskCardSize.toString()}
              onValueChange={(value) =>
                setTaskCardSize(parseInt(value) as TaskCardSize)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona un tamaño" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columnas</SelectItem>
                <SelectItem value="3">3 Columnas</SelectItem>
                <SelectItem value="4">4 Columnas</SelectItem>
              </SelectContent>
            </Select>
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
                Recibe correos electrónicos con la información acerca de tus
                tareas.
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={toggleEmailNotifications}
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
              checked={pushNotifications}
              onCheckedChange={togglePushNotifications}
            />
          </div>
          {notifMsg && (
            <div className="text-sm text-muted-foreground">{notifMsg}</div>
          )}
        </CardContent>
      </Card>

      {/* PRIVACIDAD: eliminar cuenta */}
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
            onClick={deleteAccount}
          >
            <Trash2 className="h-4 w-4" />
            Eliminar cuenta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
