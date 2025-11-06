// client/src/components/FooterGate.tsx
/**
 * @file FooterGate.tsx
 * @description Componente que actúa como puerta de enlace para el pie de página.
 * Decide si renderizar el pie de página basado en la ruta actual.
 */
import Footer from "./Footer";
import { usePathname } from "../hooks/usePathname";
import { footerHiddenOn } from "@/config/sitemap";

export default function FooterGate() {
  const path = usePathname();
  const hide = footerHiddenOn.some((p) => path.startsWith(p));
  if (hide) return null;
  return <Footer />;
}
