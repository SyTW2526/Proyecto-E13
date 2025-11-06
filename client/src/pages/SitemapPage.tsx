// client/src/pages/SitemapPage.tsx
/**
 * @file SitemapPage.tsx
 * @description Página que muestra el mapa del sitio con enlaces a todas las páginas principales.
 */
import { sitemap } from "@/config/sitemap";

export default function SitemapPage() {
  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold tracking-tight mb-4">
        Mapa del sitio
      </h1>
      <ul className="space-y-2">
        {sitemap.map(({ label, href, Icon }) => (
          <li key={href} className="flex items-center gap-2">
            <Icon className="h-4 w-4" aria-hidden />
            <a
              href={href}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
