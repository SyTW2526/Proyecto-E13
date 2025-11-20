import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import NavigationMenuWithActiveItem from "@/components/customized/navigation-menu/navigation-menu-05";
import ThemeToggle from "@/components/themeToggle";
import { useAuth } from "@/hooks/useAuth";
import { navigationItems } from "@/config/navigation";
import DropdownMenuWithIcon from "@/components/customized/dropdown-menu/dropdown-menu-02";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
                <div className="hidden md:flex md:items-center">
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
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden">
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        leftIcon={"IconMenu2"}
                      />
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Menú</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-4 mt-6">
                        <div className="flex items-center gap-3 p-3 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.image} alt={user?.name} />
                            <AvatarFallback>
                              {user?.name && user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user?.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {navigationItems.map((item) => (
                            <Button
                              key={item.href}
                              variant="ghost"
                              className="justify-start"
                              leftIcon={item.icon}
                              onClick={() => {
                                navigate(item.href);
                                setMobileMenuOpen(false);
                              }}
                              text={item.title}
                            />
                          ))}
                        </div>
                        <div className="border-t pt-4 flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            className="justify-start"
                            leftIcon="IconSettings"
                            onClick={() => {
                              navigate("/settings");
                              setMobileMenuOpen(false);
                            }}
                            text="Configuración"
                          />
                          <Button
                            variant="ghost"
                            className="justify-start text-destructive"
                            leftIcon="IconLogout"
                            onClick={handleLogout}
                            text="Cerrar sesión"
                          />
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
