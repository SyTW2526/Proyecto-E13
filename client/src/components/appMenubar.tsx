import Logo from "@/assets/Logo";
import DropdownMenuWithIcon from "@/components/customized/dropdown-menu/dropdown-menu-02";
import NavigationMenuWithActiveItem from "@/components/customized/navigation-menu/navigation-menu-05";
import ThemeToggle from "@/components/themeToggle";
import LanguageSelector from "@/components/languageSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationItems } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AppMenubar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate("/", { replace: true });
    setMobileMenuOpen(false);
  };

  const logoFill = theme === "dark" ? "#ffffff" : "#000000";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60 w-fit md:w-6xl rounded-md mx-auto px-4 mt-4 mb-2">
      <div className="mx-auto flex max-w-6xl h-full justify-between items-center gap-20">
          <Link to="/" className="flex items-center gap-2">
            <Logo fill={logoFill} width={32} height={32} className="h-8 w-8" />
            <span className="text-lg font-semibold">{t("app.name")}</span>
          </Link>

          <div className="hidden md:block">
            {isAuthenticated && <NavigationMenuWithActiveItem />}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                {/* Campana de notificaciones (desktop y móvil) */}
                <NotificationBell />

                {/* Desktop: menú de usuario */}
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
                        <SheetTitle>{t("nav.menu")}</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-2 mt-6">
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
                              text={t(item.title)}
                            />
                          ))}
                          <div className="border-t pt-4 flex flex-col gap-2">
                            <LanguageSelector variant="button" />
                            <Button
                              variant="ghost"
                              className="justify-start"
                              leftIcon="IconSettings"
                              onClick={() => {
                                navigate("/settings");
                                setMobileMenuOpen(false);
                              }}
                              text={t("nav.settings")}
                            />
                            <Button
                              variant="ghost"
                              className="justify-start text-destructive"
                              leftIcon="IconLogout"
                              onClick={handleLogout}
                              text={t("auth.logout")}
                            />
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            )}
            {!isAuthenticated && <LanguageSelector variant="button" />}
            <ThemeToggle />
          </div>
      </div>
    </header>
  );
}
