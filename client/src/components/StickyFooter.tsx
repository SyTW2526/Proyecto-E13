// client/src/components/StickyFooter.tsx
/**
 * @file StickyFooter.tsx
 * @description Componente de pie de página fijo que proporciona enlaces rápidos
 * y un botón para volver al inicio de la página.
 */
import { ArrowUp, Map, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function StickyFooter() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const linkCls =
    "inline-flex items-center gap-1.5 hover:text-foreground transition-colors";

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur">
      <div className="mx-auto max-w-4xl px-3">
        <div className="relative flex h-10 items-center justify-center text-sm text-muted-foreground">
          <Link to="/sitemap" className={linkCls} aria-label="Mapa del sitio">
            <Map className="h-4 w-4" /> Mapa del sitio
          </Link>
          <span className="mx-3 opacity-50">|</span>
          <Link to="/contacts" className={linkCls} aria-label="Contacto">
            <Users className="h-4 w-4" /> Contacto
          </Link>
          <span className="mx-3 opacity-50">|</span>
          <Link to="/settings" className={linkCls} aria-label="Ajustes">
            <Settings className="h-4 w-4" /> Ajustes
          </Link>
          <button
            type="button"
            onClick={scrollTop}
            aria-label="Volver arriba"
            className="absolute right-0 inline-flex items-center rounded-md border px-2 py-1 text-xs hover:text-foreground"
            title="Arriba"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        <div className="h-7 text-center text-xs text-muted-foreground">
          © 2025 Equipo 13 — Proyecto-E13
        </div>
      </div>
    </footer>
  );
}
