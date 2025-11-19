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
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthenticateMode } from "@/types/components";
import { LoginFormProps } from "@/types/components";
import { firstZodIssueMessage } from "@/lib/utils";
import {
  googleAuthSchema,
  loginSchema,
  registerSchema,
} from "@/schemas/validationSchemas";

function getGis() {
  return window.google?.accounts?.id;
}

export function LoginForm({ forceMode, linkTo }: LoginFormProps) {
  const [mode, setMode] = useState<AuthenticateMode>(forceMode ?? "login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const googleClientId =
    (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? undefined;
  const [gisReady, setGisReady] = useState(false);
  const [googleBtnRendered, setGoogleBtnRendered] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const {
    isAuthenticated,
    isLoading,
    error: authError,
    loginWithGoogle,
    login,
    register,
    clearAuthError,
  } = useAuth();

  const error = localError || authError;

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Usuario autenticado, redirigiendo al dashboard...");
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (forceMode) setMode(forceMode);
    clearAuthError();
    setLocalError(null);
    setGoogleBtnRendered(false);
  }, [forceMode, clearAuthError]);

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

  useEffect(() => {
    const apiG = getGis();
    if (!apiG || !googleBtnRef.current) return;
    if (!googleClientId) {
      console.error("Google Client ID no configurado");
      setLocalError(
        "Google Client ID no configurado. Verifica tu archivo .env",
      );
      return;
    }
    if (!gisReady || googleBtnRendered) return;

    googleBtnRef.current.innerHTML = "";
    try {
      apiG.initialize({
        client_id: googleClientId,
        callback: async (resp) => {
          const idToken = resp?.credential;
          if (!idToken) {
            setLocalError(
              "Error de autorización de Google. Verifica que tu origen (localhost:5173) esté autorizado en Google Cloud Console.",
            );
            return;
          }

          const tokenValidation = googleAuthSchema.safeParse({ idToken });
          if (!tokenValidation.success) {
            setLocalError(firstZodIssueMessage(tokenValidation.error));
            return;
          }
          const result = await loginWithGoogle(tokenValidation.data.idToken);
          if (result.success) {
            setOk("Login con Google exitoso");
          } else {
            setLocalError(result.error || "Error al iniciar sesión con Google");
          }
        },
        ux_mode: "popup",
        use_fedcm_for_prompt: false,
      });

      apiG.renderButton(googleBtnRef.current, {
        type: "standard",
        size: "large",
        width: 240,
        theme: "outline",
        text: "signin_with",
        shape: "rectangular",
        locale: "es",
      });

      setGoogleBtnRendered(true);
    } catch (error) {
      console.error("Error al inicializar Google Sign-In:", error);
      setLocalError(
        "Error al inicializar Google Sign-In. Verifica la configuración.",
      );
    }
  }, [googleClientId, gisReady, googleBtnRendered, loginWithGoogle]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();
    setOk(null);

    if (mode === "register") {
      const parsed = registerSchema.safeParse({ name, email, password });
      if (!parsed.success) {
        setLocalError(firstZodIssueMessage(parsed.error));
        return;
      }
      const result = await register(
        parsed.data.name,
        parsed.data.email,
        parsed.data.password,
      );
      if (result.success) {
        setOk("Registro exitoso. Redirigiendo al dashboard...");
      } else {
        setLocalError(result.error || "Error al autenticar");
      }
      return;
    }

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setLocalError(firstZodIssueMessage(parsed.error));
      return;
    }

    const result = await login(parsed.data.email, parsed.data.password);
    if (result.success) {
      setOk("Login correcto. Redirigiendo...");
    } else {
      setLocalError(result.error || "Error al autenticar");
    }
  }
  const otherHref = linkTo ?? (mode === "login" ? "/register" : "/login");
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10">
      <div className="mx-auto w-full max-w-sm md:max-w-md">
        <Card className="shadow-lg border-border/50 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl tracking-tight">
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </CardTitle>
            <CardDescription>Bienvenido a TaskGrid</CardDescription>
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
                      placeholder="John Doe"
                      disabled={isLoading}
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
                    placeholder="JohnDoe@example.com"
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading
                    ? "Cargando..."
                    : mode === "login"
                      ? "Entrar"
                      : "Registrarme"}
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
                    onClick={() => {
                      setMode(mode === "login" ? "register" : "login");
                      clearAuthError();
                    }}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {mode === "login" ? "Crear una cuenta" : "Ya tengo cuenta"}
                  </Button>
                )}
                <div className="w-full flex justify-center h-11 relative">
                  {!googleBtnRendered && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-60 h-11 bg-muted/50 animate-pulse rounded-md" />
                    </div>
                  )}
                  <div
                    ref={googleBtnRef}
                    className={`w-full flex justify-center ${googleBtnRendered ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                  />
                </div>
                <FieldDescription className="text-center text-xs text-muted-foreground">
                  Al continuar aceptas los Términos y la Política de Privacidad
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
