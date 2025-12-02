import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import {
  statusConfig,
  priorityConfig,
  taskFilterLabels,
} from "@/config/taskConfig";
import type { TaskStatus, TaskPriority } from "@/types/tasks-system/task";

// Types
interface FilterProps<T> {
  value: T | "all";
  onChange: (value: T | "all") => void;
  showAll?: boolean;
  variant?: "default" | "compact";
  className?: string;
}

interface TaskFilterConfig {
  placeholder: string;
  allLabel: string;
  config: Record<string, { color: string; label: string }>;
  icon?: string;
}

// Base TaskFilter Component
function TaskFilter<T extends string>({
  value,
  onChange,
  showAll = true,
  variant = "default",
  className = "",
  filterConfig,
}: FilterProps<T> & { filterConfig: TaskFilterConfig }) {
  const currentConfig = value !== "all" ? filterConfig.config[value] : null;

  if (variant === "compact") {
    return (
      <Select value={value} onValueChange={(val) => onChange(val as T | "all")}>
        <SelectTrigger className={`!h-auto !w-auto !p-0 !border-0 !bg-transparent !shadow-none !outline-none !ring-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!border-0 [&>svg]:hidden ${className}`}>
          <Badge
            variant="outline"
            className={`${currentConfig?.color || ""} cursor-pointer hover:opacity-80 transition-opacity`}
            leftIcon={filterConfig.icon}
            rightIcon="IconChevronDown"
          >
            {currentConfig?.label || filterConfig.placeholder}
          </Badge>
        </SelectTrigger>
        <SelectContent>
          {showAll && (
            <SelectItem value="all">{filterConfig.allLabel}</SelectItem>
          )}
         {Object.entries(filterConfig.config).map(([key, config]) => (
          <SelectItem key={key} value={key}>
            <Badge
              variant="outline"
              className={config.color}
              leftIcon={filterConfig.icon}
            >
              {config.label}
            </Badge>
          </SelectItem>
        ))}
        </SelectContent>
      </Select>
    );
  }

  // Default variant
  return (
    <Select value={value} onValueChange={(val) => onChange(val as T | "all")}>
      <SelectTrigger className={`h-8 text-sm ${className}`}>
        <SelectValue placeholder={filterConfig.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && (
          <SelectItem value="all">{filterConfig.allLabel}</SelectItem>
        )}
        {Object.entries(filterConfig.config).map(([key, config]) => (
          <SelectItem key={key} value={key}>
            <Badge
              variant="outline"
              className={config.color}
              leftIcon={filterConfig.icon}
            >
              {config.label}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Status Filter
export function TaskStatusFilter(props: FilterProps<TaskStatus>) {
  return (
    <TaskFilter
      {...props}
      filterConfig={{
        placeholder: taskFilterLabels.statusPlaceholder,
        allLabel: taskFilterLabels.statusAll,
        config: statusConfig,
        icon: "IconCircle",
      }}
    />
  );
}

// Priority Filter
export function TaskPriorityFilter(props: FilterProps<TaskPriority>) {
  return (
    <TaskFilter
      {...props}
      filterConfig={{
        placeholder: taskFilterLabels.priorityPlaceholder,
        allLabel: taskFilterLabels.priorityAll,
        config: priorityConfig,
        icon: "IconFlag",
      }}
    />
  );
}

// Sort Filter Types
type SortField = "name" | "dueDate" | "priority" | "createdAt" | "updatedAt";
type SortOrder = "asc" | "desc";

interface TaskSortFilterProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortFieldChange: (field: SortField) => void;
  onToggleOrder: () => void;
  className?: string;
}

// Sort Filter Component
export function TaskSortFilter({
  sortField,
  sortOrder,
  onSortFieldChange,
  onToggleOrder,
  className = "",
}: TaskSortFilterProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select
        value={sortField}
        onValueChange={(value) => onSortFieldChange(value as SortField)}
      >
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder={taskFilterLabels.sortPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(taskFilterLabels.sortFields).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        onClick={onToggleOrder}
        title={
          sortOrder === "asc"
            ? taskFilterLabels.sortOrder.asc
            : taskFilterLabels.sortOrder.desc
        }
        leftIcon={
          sortOrder === "asc" ? "IconSortAscending" : "IconSortDescending"
        }
      />
    </div>
  );
}
