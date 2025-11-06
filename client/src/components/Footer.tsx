// client/src/components/Footer.tsx
/**
 * @file Footer.tsx
 * @description Componente del pie de página principal que muestra enlaces de navegación,
 * información del equipo y enlaces útiles.
 */

import { ExternalLink, Settings, Map, Users as UsersIcon } from "lucide-react";
import { sitemap } from "@/config/sitemap";
import { team } from "@/config/team";

export default function Footer() {
  return (
    <footer className="border-t bg-background text-muted-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-3">
        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-foreground">
            <a
              href="/sitemap"
              className="inline-flex items-center gap-2 hover:underline underline-offset-4"
            >
              <Map className="h-4 w-4" /> Mapa del sitio
            </a>
          </h2>
          <ul className="space-y-2">
            {sitemap.map(({ label, href, Icon }) => (
              <li key={href} className="flex items-center gap-2">
                <Icon className="h-4 w-4" aria-hidden />
                <a
                  href={href}
                  className="hover:text-foreground underline-offset-4 hover:underline"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-foreground">
            <a
              href="/contacts"
              className="inline-flex items-center gap-2 hover:underline underline-offset-4"
            >
              <UsersIcon className="h-4 w-4" /> Contactos
            </a>
          </h2>
          <ul className="space-y-2">
            {team.map((m) => (
              <li key={m.name} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" aria-hidden />
                <a
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground underline-offset-4 hover:underline"
                >
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-foreground">
            Ajustes
          </h2>
          <a
            href="/settings"
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:text-foreground"
          >
            <Settings className="h-4 w-4" aria-hidden />
            Página de ajustes
          </a>
        </section>
      </div>
      <div className="border-t">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-center">
          © 2025 Equipo 13 — Proyecto-E13
        </div>
      </div>
    </footer>
  );
}
