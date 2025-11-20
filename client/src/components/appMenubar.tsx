import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import NavigationMenuWithActiveItem from "@/components/customized/navigation-menu/navigation-menu-05";
import ThemeToggle from "@/components/themeToggle";
import { useAuth } from "@/hooks/useAuth";
import DropdownMenuWithIcon from "@/components/customized/dropdown-menu/dropdown-menu-02";
import CreateTaskDialog from "@/components/createDialogs/createTaskDialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AppMenubar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate("/", { replace: true });
    setMobileMenuOpen(false);
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
              <>
                <CreateTaskDialog />
                <DropdownMenuWithIcon
                  onLogout={handleLogout}
                  userName={user?.name}
                  userEmail={user?.email}
                  userInitial={
                    user?.image
                      ? undefined
                      : user?.name && user.name.charAt(0).toUpperCase()
                  }
                  userImage={user?.image}
                  onSettings={() => navigate("/settings")}
                />
                <div className="md:hidden">
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Icon as="IconMenu2" size={20} />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Menú</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-4 mt-6">
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => {
                              navigate("/dashboard");
                              setMobileMenuOpen(false);
                            }}
                          >
                            Dashboard
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => {
                              navigate("/tasks");
                              setMobileMenuOpen(false);
                            }}
                          >
                            Tareas
                          </Button>
                        </div>
                        <div className="border-t pt-4 flex flex-col gap-2">
                          <div className="px-3 py-2">
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user?.email}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => {
                              navigate("/settings");
                              setMobileMenuOpen(false);
                            }}
                          >
                            Configuración
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start text-destructive"
                            onClick={handleLogout}
                          >
                            Cerrar sesión
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
