import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
// Icon is provided to buttons via `leftIcon` prop (resolved by Button component)
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/config/navigation";

export default function NavigationMenuWithActiveItem() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-8">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink
                className={cn(
                  "relative group inline-flex h-9 w-max items-center justify-center px-0.5 py-2 text-sm font-medium",
                  "before:absolute before:bottom-0 before:inset-x-0 before:h-[2px] before:bg-primary before:scale-x-0 before:transition-transform",
                  "hover:before:scale-x-100 hover:text-accent-foreground",
                  "focus:before:scale-x-100 focus:text-accent-foreground focus:outline-hidden",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "data-active:before:scale-x-100 data-[state=open]:before:scale-x-100",
                  "hover:bg-transparent active:bg-transparent focus:bg-transparent",
                )}
                asChild
                active={isActive}
              >
                <Button
                  variant="ghost"
                  leftIcon={item.icon}
                  iconSize={20}
                  className="flex-row items-center gap-2.5 inline-flex items-center p-0"
                  onClick={() => navigate(item.href)}
                >
                  {item.title}
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
