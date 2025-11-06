// client/src/pages/SettingsPage.tsx
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
import { Switch } from "../components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  // Estado local de ejemplo; conecta con tu backend cuando esté listo
  const [name, setName] = useState("Laura");
  const [email, setEmail] = useState("laura@example.com");
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [darkPref, setDarkPref] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    // TODO: sustituir por llamada real al backend (p.ej., api.put("/me", {...}))
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setMsg("Cambios guardados.");
  }

  function applyTheme(toggle: boolean) {
    setDarkPref(toggle);
    const root = document.documentElement;
    if (toggle) root.classList.add("dark");
    else root.classList.remove("dark");
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Ajustes</h1>
        <p className="text-sm text-muted-foreground">
          Preferencias de cuenta, notificaciones y privacidad.
        </p>
      </header>

      {/* Perfil */}
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
        <CardContent>
          <form onSubmit={onSaveProfile} className="grid gap-4 sm:grid-cols-2">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>

            <Separator className="sm:col-span-2" />

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
              <div className="text-sm text-muted-foreground">{msg}</div>
              <Button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preferencias */}
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
            <Switch checked={darkPref} onCheckedChange={applyTheme} />
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
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
            <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Notificaciones push</div>
              <div className="text-sm text-muted-foreground">
                Avisos en tiempo real del navegador.
              </div>
            </div>
            <Switch checked={notifPush} onCheckedChange={setNotifPush} />
          </div>
        </CardContent>
      </Card>

      {/* Privacidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> Privacidad
          </CardTitle>
          <CardDescription>Exportar datos o eliminar cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline">Exportar mis datos</Button>
          <Button
            variant="destructive"
            className="inline-flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar cuenta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
