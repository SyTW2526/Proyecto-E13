import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Header() {
  // Cambiar con el manejo de estados
  const isAuthenticated = false;

  return (
    <header className="sticky top-4 z-50 mx-auto w-[95%] max-w-2xl">
      <div className="bg-card/70 backdrop-blur-md border rounded-2xl shadow-md px-4 py-2.5">
        <div className="flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 group">
            <span className="font-bold text-xl">TaskGrid</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/home"
              className="text-sm font-medium hover:scale-105 transition-transform"
            >
              Inicio
            </Link>

            <Link
              to="/tasks"
              className="text-sm font-medium hover:scale-105 transition-transform"
            >
              Mis Tareas
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                <Link to="/register">
                  <Button variant="ghost" size="sm">
                    Signup
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="default">Login</Button>
                </Link>
              </>
            ) : (
              <>
                {
                  <Button variant="ghost" size="sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 mr-2"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Perfil
                  </Button>
                }
                {/* <Button variant="default" size="sm" onClick={logout}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-log-out-icon lucide-log-out"
                  >
                    <path d="m16 17 5-5-5-5" />
                    <path d="M21 12H9" />
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  </svg>
                  Salir
                </Button> */}
              </>
            )}
          </div>
        </div>

        {/* Navegación móvil */}
        <nav className="md:hidden flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <Link
            to="/home"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Inicio
          </Link>
          {isAuthenticated && (
            <Link
              to="/tasks"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Mis Tareas
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
