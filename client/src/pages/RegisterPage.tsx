// client/src/pages/RegisterPage.tsx
/**
 * @file RegisterPage.tsx
 * @description Página de registro que utiliza el componente LoginForm
 * para registrar nuevos usuarios.
 */
import { LoginForm } from "@/components/login-form";

export default function RegisterPage() {
  return <LoginForm forceMode="register" linkTo="/login" />;
}
