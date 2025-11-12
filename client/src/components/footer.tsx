/**
 * @file footer.tsx
 * @description Componente de pie de página fijo que proporciona enlaces rápidos
 * y un botón para volver al inicio de la página.
 */
import { useNavigate } from "react-router-dom";
import React from "react";
import Icon from "./ui/icon";
import { Button } from "./ui/button";
import {
  IconMap,
  IconUser,
  IconSettings,
  IconArrowUp,
  IconCopyright,
} from "@tabler/icons-react";

const links = [
  {
    to: localStorage.getItem("token") ? "/dashboard" : "/",
    label: "Inicio",
    icon: IconMap,
    ariaLabel: "Inicio",
  },
  {
    to: "/contacts",
    label: "Contacto",
    icon: IconUser,
    ariaLabel: "Contacto",
  },
  {
    to: "/settings",
    label: "Ajustes",
    icon: IconSettings,
    ariaLabel: "Ajustes",
  },
];

export default function Footer({
  scrollToTop = false,
}: {
  scrollToTop?: boolean;
}) {
  const navigate = useNavigate();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const linkCls =
    "inline-flex items-center gap-1.5 hover:text-foreground transition-colors";

  return (
    <footer className="border-t bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-4xl px-3">
        <div className="relative flex h-10 items-center justify-center text-sm text-muted-foreground">
          {links.map((link, index) => (
            <React.Fragment key={index}>
              <Button
                variant="link"
                className={linkCls + " p-1"}
                onClick={() => navigate(link.to)}
              >
                <Icon as={link.icon} size={12} ariaLabel={link.ariaLabel} />
                {link.label}
              </Button>
              {index < links.length - 1 && (
                <span className="mx-3 opacity-50">|</span>
              )}
            </React.Fragment>
          ))}
          {scrollToTop && (
            <Button
              variant="outline"
              onClick={scrollTop}
              aria-label="Volver arriba"
              className="absolute right-0"
            >
              <Icon
                as={IconArrowUp}
                ariaLabel="Volver arriba"
                className="inline-block"
              />
            </Button>
          )}
        </div>
        <div className="h-7 text-center align-middle gap-2 flex items-center justify-center text-xs text-muted-foreground">
          <Icon
            as={IconCopyright}
            size={12}
            ariaLabel="Copyright"
            className="inline-flex items-center"
          />
          2025 Equipo 13 — Proyecto-E13
        </div>
      </div>
    </footer>
  );
}
