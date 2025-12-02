import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ItemActionsMenuProps {
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  align?: "start" | "end" | "center";
}

export function ItemActionsMenu({
  onEdit,
  onShare,
  onDelete,
  align = "start",
}: ItemActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" leftIcon={"IconDotsVertical"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {onShare && (
          <DropdownMenuItem onClick={onShare}>
            <Icon as="IconShare" ariaLabel="Compartir" />
            Compartir
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Icon as="IconEdit" ariaLabel="Editar" />
            Editar
          </DropdownMenuItem>
        )}
        {(onShare || onEdit) && onDelete && <DropdownMenuSeparator />}
        {onDelete && (
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Icon
              as="IconTrash"
              ariaLabel="Eliminar"
              className="bg-red-500/10 text-red-600 dark:text-red-400 [&_svg]:stroke-red-600 dark:[&_svg]:stroke-red-400"
            />
            Eliminar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
