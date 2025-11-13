import { Link } from "react-router-dom";
import NavigationMenuWithActiveItem from "@/components/customized/navigation-menu/navigation-menu-05";
import ThemeToggle from "@/components/themeToggle";

export default function AppMenubar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b h-12">
      <div className="mx-auto flex max-w-7xl h-full items-center gap-4 px-3">
        <div className="flex items-center justify-between gap-6 w-full">
          <Link to="/" className="text-lg font-semibold">
            Proyecto-E13
          </Link>

          <div className="hidden md:block">
            <NavigationMenuWithActiveItem />
          </div>

          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
