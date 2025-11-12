/**
 * @file footer.tsx
 * @description Componente de pie de página fijo que proporciona enlaces rápidos
 * y un botón para volver al inicio de la página.
 */
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Icon from "./ui/icon";
import { Button } from "./ui/button";
import { getFooterLinks } from "@/config/footerLinks";

const links = getFooterLinks();

export default function Footer() {
  const navigate = useNavigate();
  const [isScrollable, setIsScrollable] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    // detect whether the page is scrollable and whether the user scrolled down
    const checkScrollable = () => {
      const doc = document.documentElement || document.body;
      const scrollHeight = doc.scrollHeight || document.body.scrollHeight;
      setIsScrollable(scrollHeight > window.innerHeight + 2); // small tolerance
    };

    const onScroll = () => setIsScrolled(window.scrollY > 0);

    checkScrollable();
    onScroll();

    window.addEventListener("resize", checkScrollable, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // observe DOM changes that might affect scroll height (async content)
    const observer = new MutationObserver(() => checkScrollable());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      window.removeEventListener("resize", checkScrollable);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);
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
        </div>
        {isScrollable && isScrolled && (
          <Button
            variant="default"
            onClick={scrollTop}
            aria-label="Volver arriba"
            className="absolute z-50 right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-top))]"
          >
            <Icon
              as="IconArrowUp"
              ariaLabel="Volver arriba"
              className="inline-block"
            />
          </Button>
        )}
        <div className="h-7 text-center align-middle gap-2 flex items-center justify-center text-xs text-muted-foreground">
          <Icon
            as="IconCopyright"
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
