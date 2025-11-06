// client/src/pages/LoginPage.tsx
/**
 * @file LoginPage.tsx
 * @description Página de inicio de sesión que utiliza el componente LoginForm
 * para autenticar a los usuarios.
 */
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return <LoginForm forceMode="login" linkTo="/register" />;
}
