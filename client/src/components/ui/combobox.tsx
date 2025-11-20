import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface ComboboxProps {
  categories: Category[];
  value: string;
  onValueChange: (value: string) => void;
  onCreateNew: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  createNewLabel?: string;
}

export function Combobox({
  categories,
  value,
  onValueChange,
  onCreateNew,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados.",
  createNewLabel = "Crear nuevo",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? categories.find((category) => category.id === value)?.name
            : placeholder}
          <Icon
            as="IconChevronDown"
            size={16}
            className="ml-2 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => {
                    onValueChange(category.id);
                    setOpen(false);
                  }}
                >
                  {category.name}
                  <Icon
                    as="IconCheck"
                    size={16}
                    className={cn(
                      "ml-auto",
                      value === category.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  onCreateNew();
                }}
                className="text-primary"
              >
                <Icon as="IconPlus" size={16} className="mr-2" />
                {createNewLabel}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
