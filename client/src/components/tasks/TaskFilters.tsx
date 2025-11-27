import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  statusConfig,
  priorityConfig,
  taskFilterLabels,
} from "@/config/taskConfig";
import type { TaskStatus, TaskPriority } from "@/types/tasks-system/task";

const FILTER_STYLES = "h-8 text-sm";

interface FilterProps<T> {
  value: T | "all";
  onChange: (value: T | "all") => void;
  showAll?: boolean;
  className?: string;
}

interface TaskFilterConfig {
  placeholder: string;
  allLabel: string;
  config: Record<string, { color: string; label: string }>;
}

function TaskFilter<T extends string>({
  value,
  onChange,
  showAll = true,
  className = `${FILTER_STYLES}`,
  filterConfig,
}: FilterProps<T> & { filterConfig: TaskFilterConfig }) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as T | "all")}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={filterConfig.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && (
          <SelectItem value="all">{filterConfig.allLabel}</SelectItem>
        )}
        {Object.entries(filterConfig.config).map(([key, config]) => (
          <SelectItem key={key} value={key}>
            <span className={config.color}>{config.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TaskStatusFilter(props: FilterProps<TaskStatus>) {
  return (
    <TaskFilter
      {...props}
      filterConfig={{
        placeholder: taskFilterLabels.statusPlaceholder,
        allLabel: taskFilterLabels.statusAll,
        config: statusConfig,
      }}
    />
  );
}

export function TaskPriorityFilter(props: FilterProps<TaskPriority>) {
  return (
    <TaskFilter
      {...props}
      filterConfig={{
        placeholder: taskFilterLabels.priorityPlaceholder,
        allLabel: taskFilterLabels.priorityAll,
        config: priorityConfig,
      }}
    />
  );
}

type SortField = "name" | "dueDate" | "priority" | "createdAt" | "updatedAt";
type SortOrder = "asc" | "desc";

interface TaskSortFilterProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortFieldChange: (field: SortField) => void;
  onToggleOrder: () => void;
}

export function TaskSortFilter({
  sortField,
  sortOrder,
  onSortFieldChange,
  onToggleOrder,
}: TaskSortFilterProps) {
  return (
    <div className="flex items-center gap-2 ml-auto">
      <Select
        value={sortField}
        onValueChange={(value) => onSortFieldChange(value as SortField)}
      >
        <SelectTrigger className={`${FILTER_STYLES}`}>
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
