import { Link, useNavigate } from "react-router-dom";
import NavigationMenuWithActiveItem from "@/components/customized/navigation-menu/navigation-menu-05";
import ThemeToggle from "@/components/themeToggle";
import { useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/store/slices/authSlice";
import { useAppSelector } from "@/hooks/useRedux";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import DropdownMenuWithIcon from "@/components/customized/dropdown-menu/dropdown-menu-02";
import { selectUser } from "@/store/slices/authSlice";

export default function AppMenubar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
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
            TaskGrid
          </Link>

          <div className="hidden md:block">
            {isAuthenticated && <NavigationMenuWithActiveItem />}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <DropdownMenuWithIcon
                onLogout={handleLogout}
                userName={user?.name}
                userEmail={user?.email}
                userInitial={
                  user?.avatar
                    ? user.avatar
                    : user?.name && user.name.charAt(0).toUpperCase()
                }
                onSettings={() => navigate("/settings")}
                // onProfile={() => navigate("/dashboard")}
              />
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
