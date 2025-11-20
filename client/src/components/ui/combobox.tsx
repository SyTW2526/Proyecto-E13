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
import { IconCheck, IconChevronDown, IconPlus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { taskFormLabels } from "@/config/taskConfig";

interface Category {
  id: string;
  name: string;
}

interface ComboboxProps {
  categories: Category[];
  value: string;
  onValueChange: (value: string) => void;
  onCreateNew: () => void;
}

export function Combobox({
  categories,
  value,
  onValueChange,
  onCreateNew,
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
            : taskFormLabels.fields.category.placeholder}
          <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={taskFormLabels.fields.category.searchPlaceholder}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              {taskFormLabels.fields.category.emptyMessage}
            </CommandEmpty>
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
                  <IconCheck
                    className={cn(
                      "ml-auto h-4 w-4",
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
                <IconPlus className="mr-2 h-4 w-4" />
                {taskFormLabels.fields.category.createNew}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
