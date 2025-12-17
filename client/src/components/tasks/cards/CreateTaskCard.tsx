import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import CreateTaskDialog from "@/components/tasks/dialogs/CreateTaskDialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CreateTaskCardProps {
  readonly filterByEditPermission?: boolean;
  readonly showCreateList?: boolean;
  readonly disabled?: boolean;
}

export function CreateTaskCard({
  filterByEditPermission = false,
  showCreateList = true,
  disabled = false,
}: CreateTaskCardProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card
        onClick={() => !disabled && setDialogOpen(true)}
        className={`py-0 group relative flex flex-col items-center justify-center min-h-[160px] border-2 border-dashed transition-all duration-300 overflow-hidden rounded-xl backdrop-blur-sm ${
          disabled
            ? "border-muted cursor-not-allowed opacity-50"
            : "border-border/50 hover:border-primary/50 hover:shadow-sm hover:shadow-primary/5 cursor-pointer bg-gradient-to-br from-card/50 via-card/30 to-transparent"
        }`}
      >
        <CardContent className="relative flex flex-col items-center justify-center gap-3 w-full p-4 sm:p-5">
          <div
            className={`rounded-full p-3 transition-colors duration-300 ${
              disabled
                ? "bg-muted/30"
                : "bg-primary/10 group-hover:bg-primary/20"
            }`}
          >
            <Icon
              as="IconPlus"
              size={28}
              className={`transition-colors duration-300 ${
                disabled
                  ? "text-muted-foreground/50"
                  : "text-primary/70 group-hover:text-primary"
              }`}
            />
          </div>
          <span
            className={`text-sm font-medium transition-colors duration-300 ${
              disabled
                ? "text-muted-foreground/50"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
          >
            {t("tasks.create.title")}
          </span>
        </CardContent>
      </Card>

      <CreateTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        filterByEditPermission={filterByEditPermission}
        showCreateList={showCreateList}
      />
    </>
  );
}
