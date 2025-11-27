import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { tasksPageLabels } from "@/config/taskConfig";
import { CreateListDialogStandalone } from "../createDialogs/createListDialog";
import { Button } from "@/components/ui/button";

interface FilterableListProps {
  title: string;
  items: Array<{
    id: string;
    name: string;
    count: number;
    description?: string;
  }>;
  selectedId: string | null;
  onItemClick: (id: string | null) => void;
  emptyMessage: string;
  icon: string;
  isLoading?: boolean;
}

export function FilterableList({
  title,
  items,
  selectedId,
  onItemClick,
  emptyMessage,
  icon,
  isLoading,
}: FilterableListProps) {
  return (
    <div>
      <div className="flex flex-row items-center justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <div className="flex gap-2">
          {/* Boton de crear listas */}
          <CreateListDialogStandalone>
            <Button leftIcon={tasksPageLabels.createButtons.list.icon} />
          </CreateListDialogStandalone>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-col sm:gap-2">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-3 rounded-md border h-[52px] animate-pulse bg-muted/20"
            >
              <div className="h-5 w-5 bg-muted rounded-full" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </div>
          ))
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                onItemClick(selectedId === item.id ? null : item.id)
              }
              className={`group flex items-center justify-between gap-2 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                selectedId === item.id
                  ? "bg-primary/10 text-primary font-medium border-transparent"
                  : "bg-card/50 dark:bg-card/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground border-transparent dark:border-border/30"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Icon
                  as={icon}
                  size={18}
                  className={
                    selectedId === item.id
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  }
                />
                <span className="font-medium truncate">
                  {item.name}
                  {item.description && ":"}
                </span>
                {item.description && (
                  <p className="text-xs text-muted-foreground truncate hidden sm:block">
                    {item.description}
                  </p>
                )}
              </div>
              <Badge
                variant="secondary"
                className={`ml-auto px-1.5 min-w-[1.5rem] justify-center rounded-full ${
                  selectedId === item.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.count}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
