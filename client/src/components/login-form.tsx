// client/src/components/login-form.tsx
/**
 * @file login-form.tsx
 * @description Componente de login/registro con soporte Google Sign-In (GIS).
 */
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
import { api, apiErrorMessage, setAuthToken } from "@/lib/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Mode = "login" | "register";

export type LoginFormProps = {
  forceMode?: Mode;
  linkTo?: string; // ruta a la “otra” página (/register o /login)
};

// Tipos mínimos de GIS
type GIdCredentialResponse = {
  clientId: string;
  credential: string;
  select_by: string;
};
type GIdInitConfig = {
  client_id: string;
  callback: (r: GIdCredentialResponse) => void;
  ux_mode?: "popup" | "redirect";
  use_fedcm_for_prompt?: boolean;
  auto_select?: boolean;
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

export function LoginForm({ forceMode, linkTo }: LoginFormProps) {
  const [mode, setMode] = useState<Mode>(forceMode ?? "login");
  useEffect(() => {
    if (forceMode) setMode(forceMode);
  }, [forceMode]);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const googleClientId =
    (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? undefined;
  const [gisReady, setGisReady] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement | null>(null);

  // Detecta que la librería de Google está cargada
  useEffect(() => {
    const checkGisLoaded = () => {
      const gis = getGis();
      if (gis) {
        setGisReady(true);
        return true;
      }
      return false;
    };

    if (!checkGisLoaded()) {
      const i = window.setInterval(() => {
        if (checkGisLoaded()) {
          window.clearInterval(i);
        }
      }, 300);
      return () => window.clearInterval(i);
    }
  }, []);

  // Inicializa GIS y renderiza el botón
  useEffect(() => {
    const apiG = getGis();
    console.log("Estado de GIS:", { apiG, ref: googleBtnRef.current, gisReady });
    if (!apiG || !googleBtnRef.current) return;

    if (!googleClientId) {
      console.error("Google Client ID no configurado");
      setError("Error de configuración de Google Sign-In");
      return;
    }

    if (!gisReady) {
      console.log("Esperando a que la biblioteca de Google se cargue...");
      return;
    }

    console.log("Inicializando Google Sign-In con:", { clientId: googleClientId });
    googleBtnRef.current.innerHTML = "";
    
    try {
      apiG.initialize({
        client_id: googleClientId,
        callback: async (resp) => {
          console.log("Google Sign-In response:", resp);
          const idToken = resp?.credential;
          if (!idToken) {
            console.error("No se recibió credencial de Google");
            setError("Google no devolvió credencial. Revisa cookies/orígenes.");
            return;
          }
          
          try {
            console.log("Enviando token al servidor...");
            const { data } = await api.post<{token: string}>("/auth/google", { idToken }, {
              headers: { "Content-Type": "application/json" },
            });
            console.log("Respuesta del servidor:", data);
            setAuthToken(data.token);
            setOk("Login con Google exitoso");
          } catch (error) {
            console.error("Error del servidor:", error);
            setError(apiErrorMessage(error));
          }
        },
        ux_mode: "popup",
        use_fedcm_for_prompt: true,
      });

      // Renderizar el botón después de la inicialización
      // Función para renderizar el botón
      const renderButton = () => {
        if (!googleBtnRef.current) return;
        googleBtnRef.current.innerHTML = "";
        apiG.renderButton(googleBtnRef.current, {
          type: "standard",
          size: "large",
          width: 240,
          theme: "outline",
          text: ok ? "continue_with" : "signin_with",
          shape: "rectangular",
          locale: "es"
        });
      };

      renderButton();
    } catch (error) {
      console.error("Error al inicializar Google Sign-In:", error);
      setError("Error al inicializar Google Sign-In. Por favor, intenta de nuevo.");
    }
  }, [googleClientId, gisReady, ok]);

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
        if (!forceMode) setMode("login");
      } else {
        const { data } = await api.post<{ token: string }>("/auth/login", {
          email,
          password,
        });
        setAuthToken(data.token);
        setOk("Login correcto.");
      }
    } catch (err: unknown) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const otherHref = linkTo ?? (mode === "login" ? "/register" : "/login");

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

                {forceMode ? (
                  <Link
                    to={otherHref}
                    className="inline-flex w-full items-center justify-center rounded-md border px-3 py-2 text-sm hover:text-foreground"
                  >
                    {mode === "login" ? "Crear una cuenta" : "Ya tengo cuenta"}
                  </Link>
                ) : (
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
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">o</span>
                  </div>
                </div>

                <div ref={googleBtnRef} className="w-full flex justify-center" />

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
