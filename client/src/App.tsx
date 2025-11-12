import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import LandingPage from "@/pages/public/landingPage";
import LoginPage from "@/pages/public/loginPage";
import RegisterPage from "@/pages/public/registerPage";
import DashboardPage from "@/pages/authenticated/dashboardPage";
import SettingsPage from "@/pages/authenticated/settingsPage";
import ContactsPage from "@/pages/public/contactsPage";
import ProtectedRoute from "@/components/auth/protectedRoute";
import Footer from "@/components/footer";
import ThemeToggle from "@/components/themeToggle";

export default function App() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-muted/30">
      <div className="fixed z-50 right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))]">
        <ThemeToggle />
      </div>
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RegisterPage />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
