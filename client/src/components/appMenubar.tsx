import { Link, useNavigate } from "react-router-dom";
import NavigationMenuWithActiveItem from "@/components/customized/navigation-menu/navigation-menu-05";
import ThemeToggle from "@/components/themeToggle";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/store/slices/authSlice";
import { useAppSelector } from "@/hooks/useRedux";
import { selectIsAuthenticated } from "@/store/slices/authSlice";

export default function AppMenubar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b h-12">
      <div className="mx-auto flex max-w-7xl h-full items-center gap-4 px-3">
        <div className="flex items-center justify-between gap-6 w-full">
          <Link to="/" className="text-lg font-semibold">
            Proyecto-E13
          </Link>

          <div className="hidden md:block">
            {isAuthenticated && <NavigationMenuWithActiveItem />}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <Button
                  variant="secondary"
                  leftIcon="IconLogout"
                  aria-label="Cerrar sesión"
                  onClick={handleLogout}
                >
                  <span>Cerrar sesión</span>
                </Button>
                <Button
                  variant="secondary"
                  leftIcon="IconSettings"
                  aria-label="Ajustes"
                  onClick={() => navigate("/settings")}
                />
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
