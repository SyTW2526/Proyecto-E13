import { useNavigate } from "react-router-dom";
import Icon from "./ui/icon";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60 h-14"
      role="contentinfo"
      aria-label={t("footer.ariaLabel")}
    >
      <div className="mx-auto max-w-4xl px-3 h-full flex items-center justify-center gap-8 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon as="IconCopyright" size={16} className="inline-block" />
          <span className="whitespace-nowrap">
            {new Date().getFullYear()} — {t("footer.rights")}
          </span>
        </div>

        <Button
          variant="link"
          leftIcon="IconMail"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded p-0"
          aria-label={t("footer.contact")}
          onClick={() => navigate("/contacts")}
        >
          <span>{t("footer.contact")}</span>
        </Button>
      </div>
    </footer>
  );
}
