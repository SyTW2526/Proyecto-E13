import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

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
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
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
              className={`flex items-center justify-between gap-2 p-3 rounded-md cursor-pointer transition-colors ${
                selectedId === item.id
                  ? "bg-primary/20 dark:bg-primary/30 hover:bg-primary/25 dark:hover:bg-primary/35"
                  : "bg-muted bg-opacity-15 dark:bg-opacity-25 hover:bg-opacity-25 dark:hover:bg-opacity-35"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon as={icon} size={20} />
                <span className="font-medium">
                  {item.name}
                  {item.description && ":"}
                </span>
                <p>{item.description}</p>
              </div>
              <Badge className="px-1.5 rounded-full bg-foreground/7 text-foreground">
                {item.count}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
