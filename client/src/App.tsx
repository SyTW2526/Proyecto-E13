import AppMenubar from "@/components/appMenubar";
import ProtectedRoute from "@/components/auth/protectedRoute";
import Footer from "@/components/footer";
import { useAppSelector } from "@/hooks/useRedux";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Lazy loading de páginas para code-splitting
const LandingPage = lazy(() => import("@/pages/public/landingPage"));
const LoginPage = lazy(() => import("@/pages/public/loginPage"));
const RegisterPage = lazy(() => import("@/pages/public/registerPage"));
const DashboardPage = lazy(() => import("@/pages/authenticated/dashboardPage"));
const SettingsPage = lazy(() => import("@/pages/authenticated/settingsPage"));
const ContactsPage = lazy(() => import("@/pages/public/contactsPage"));

export default function App() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const publicRoute = (Page: React.ComponentType) =>
    isAuthenticated ? <Navigate to="/dashboard" replace /> : <Page />;

  const protectedRoute = (Page: React.ComponentType) => (
    <ProtectedRoute>
      <Page />
    </ProtectedRoute>
  );

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-muted/30">
      <AppMenubar />

      <main className="flex-1 overflow-auto pt-12 pb-14">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              Cargando...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={publicRoute(LandingPage)} />
            <Route path="/login" element={publicRoute(LoginPage)} />
            <Route path="/register" element={publicRoute(RegisterPage)} />

            <Route path="/dashboard" element={protectedRoute(DashboardPage)} />
            <Route path="/settings" element={protectedRoute(SettingsPage)} />

            <Route path="/contacts" element={<ContactsPage />} />

            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
