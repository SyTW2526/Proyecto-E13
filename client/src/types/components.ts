export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export type AuthenticateMode = "login" | "register";

export interface LoginFormProps {
  forceMode?: AuthenticateMode;
  linkTo?: string;
}
