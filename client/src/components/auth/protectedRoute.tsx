import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { ProtectedRouteProps } from "@/types/components";

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
