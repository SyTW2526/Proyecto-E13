/**
 * @file RegisterPage.tsx
 * @description Página de registro que utiliza Redux para autenticación.
 */
import { LoginForm } from "@/components/auth/LoginForm";

export default function RegisterPage() {
  return <LoginForm forceMode="register" linkTo="/login" />;
}
