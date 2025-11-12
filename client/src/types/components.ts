export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export type AuthenticateMode = "login" | "register";

export interface LoginFormProps {
  forceMode?: AuthenticateMode;
  linkTo?: string;
}

export type IconType = React.ComponentType<{
  size?: number;
  stroke?: number;
  className?: string;
}>;

export interface FeatureCardProps {
  // allow either a component or the name of an icon (resolved at render time)
  icon: IconType | string;
  title: string;
  description?: string;
  className?: string;
  iconSize?: number;
  iconLabel?: string;
  children?: React.ReactNode;
}
