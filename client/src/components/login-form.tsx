import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { api, setAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Mode = "login" | "register";

// Tipos mínimos GIS
type GIdCredentialResponse = {
  clientId: string;
  credential: string;
  select_by: string;
};
type GIdInitConfig = {
  client_id: string;
  callback: (r: GIdCredentialResponse) => void;
  ux_mode?: "popup" | "redirect";
  auto_select?: boolean;
  use_fedcm_for_prompt?: boolean; // habilita FedCM
};
type GIdApi = {
  initialize(config: GIdInitConfig): void;
  prompt(): void;
  renderButton(parent: HTMLElement, options: Record<string, unknown>): void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GIdApi } };
  }
}

function getGis(): GIdApi | undefined {
  return window.google?.accounts?.id;
}

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const googleClientId =
    (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? undefined;
  const [gisReady, setGisReady] = useState(false);
  const mounted = useRef(false);
  const googleBtnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mounted.current = true;
    const id = window.setInterval(() => {
      if (!mounted.current) return;
      setGisReady(Boolean(getGis()));
    }, 300);
    return () => {
      mounted.current = false;
      window.clearInterval(id);
    };
  }, []);

  // Inicializa GIS y pinta el botón oficial cuando hay ID + SDK listo
  useEffect(() => {
    const apiG = getGis();
    if (!googleClientId || !gisReady || !apiG || !googleBtnRef.current) return;

    // Evitar duplicados si se re-renderiza
    googleBtnRef.current.innerHTML = "";

    apiG.initialize({
      client_id: googleClientId,
      callback: async (resp: GIdCredentialResponse) => {
        try {
          setLoading(true);
          const { credential: idToken } = resp;
          const { data } = await api.post<{ token: string }>("/auth/google", {
            idToken,
          });
          setAuthToken(data.token);
          setOk("Login con Google correcto.");
          setError(null);
        } catch (err: unknown) {
          const message = axios.isAxiosError(err)
            ? ((err.response?.data as { error?: string } | undefined)?.error ??
              err.message)
            : "Error en Google Sign-In";
          setError(message);
          setOk(null);
        } finally {
          setLoading(false);
        }
      },
      ux_mode: "popup", // evita dependencias de redirecciones
      use_fedcm_for_prompt: true, // funciona aunque se bloqueen cookies de terceros
      auto_select: false,
    });

    // Botón oficial (Google recomienda usarlo)
    apiG.renderButton(googleBtnRef.current, {
      type: "standard",
      size: "large",
      text: "signin_with",
      width: "100",
      theme: "outline",
      shape: "rectangular",
      logo_alignment: "left",
    });
  }, [googleClientId, gisReady]);

  const disabled = useMemo(() => loading, [loading]);

  function validate(): string | null {
    if (!email.includes("@")) return "Email inválido";
    if (mode === "register" && name.trim().length < 2)
      return "Nombre demasiado corto";
    if (password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    const v = validate();
    if (v) return setError(v);
    setLoading(true);
    try {
      if (mode === "register") {
        await api.post("/auth/register", { name, email, password });
        setOk("Registro correcto. Ya puedes iniciar sesión.");
        setMode("login");
      } else {
        const { data } = await api.post<{ token: string }>("/auth/login", {
          email,
          password,
        });
        setAuthToken(data.token);
        setOk("Login correcto.");
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? ((err.response?.data as { error?: string } | undefined)?.error ??
          err.message)
        : "Error de red";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // Ya no usamos un botón propio para Google; montamos el oficial en googleBtnRef
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="mx-auto w-full max-w-sm md:max-w-md">
        <Card className="shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl tracking-tight">
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </CardTitle>
            <CardDescription>
              Gestiona tus tareas y notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <FieldGroup>
                {mode === "register" && (
                  <Field>
                    <FieldLabel>Nombre</FieldLabel>
                    <Input
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Laura Álvarez"
                      disabled={disabled}
                      required
                    />
                  </Field>
                )}
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="laura@example.com"
                    disabled={disabled}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Contraseña</FieldLabel>
                  <Input
                    type="password"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={disabled}
                    required
                  />
                </Field>

                {error && (
                  <FieldDescription className="text-center text-destructive">
                    {error}
                  </FieldDescription>
                )}
                {ok && (
                  <FieldDescription className="text-center text-green-600 dark:text-green-400">
                    {ok}
                  </FieldDescription>
                )}

                <Button type="submit" disabled={disabled} className="w-full">
                  {mode === "login" ? "Entrar" : "Registrarme"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                  disabled={disabled}
                  className="w-full"
                >
                  {mode === "login" ? "Crear una cuenta" : "Ya tengo cuenta"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      o
                    </span>
                  </div>
                </div>

                {/* Aquí se renderiza el botón oficial de Google */}
                <div
                  ref={googleBtnRef}
                  className="w-full flex justify-center"
                />

                <FieldDescription className="text-center text-xs text-muted-foreground">
                  Al continuar acepto los Términos y la Política de privacidad
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
