export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitializing: boolean;
}
