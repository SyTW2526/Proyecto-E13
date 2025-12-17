import Icon from "@/components/ui/icon";
import { CreateListDialogStandalone } from "@/components/lists/CreateListDialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function CreateListCard() {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="group flex items-center justify-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm hover:shadow-primary/5 active:scale-[0.99] text-left w-full"
      >
        <div className="rounded-full p-1.5 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          <Icon
            as="IconPlus"
            size={16}
            className="text-primary/70 group-hover:text-primary transition-colors duration-300"
          />
        </div>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {t("lists.create.title")}
        </span>
      </button>

      <CreateListDialogStandalone
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
