/**
 * @file LoginPage.tsx
 * @description Página de inicio de sesión que utiliza Redux para autenticación.
 */
import { LoginForm } from "@/components/auth/loginForm";

export default function LoginPage() {
  return <LoginForm forceMode="login" linkTo="/register" />;
}
