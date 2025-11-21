import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { FormField } from "./FormField";
import {
  priorityConfig,
  statusConfig,
  taskFormLabels,
} from "@/config/taskConfig";
import type { TaskPriority, TaskStatus } from "@/types/tasks-system/task";
import type { List } from "@/types/tasks-system/list";

interface TaskFormFieldsProps {
  formData: {
    name: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    listId: string;
    dueDate: string;
  };
  updateField: (field: string, value: string) => void;
  accessibleLists: List[];
  onCreateList: () => void;
}

export function TaskFormFields({
  formData,
  updateField,
  accessibleLists,
  onCreateList,
}: TaskFormFieldsProps) {
  return (
    <>
      {/* Nombre y Categoría - 1 columna en móvil, 2 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <FormField
          label={taskFormLabels.fields.name.label}
          htmlFor="name"
          required={taskFormLabels.fields.name.required}
        >
          <Input
            id="name"
            placeholder={taskFormLabels.fields.name.placeholder}
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />
        </FormField>

        <FormField
          label={taskFormLabels.fields.list.label}
          htmlFor="list"
          required={taskFormLabels.fields.list.required}
        >
          <Combobox
            items={accessibleLists}
            value={formData.listId}
            onValueChange={(listId) => updateField("listId", listId)}
            onCreateNew={onCreateList}
            placeholder={taskFormLabels.fields.list.placeholder}
            searchPlaceholder={taskFormLabels.fields.list.searchPlaceholder}
            emptyMessage={taskFormLabels.fields.list.emptyMessage}
            createNewLabel={taskFormLabels.fields.list.createNew}
          />
        </FormField>
      </div>

      {/* Fecha de vencimiento */}
      <FormField label={taskFormLabels.fields.dueDate.label} htmlFor="dueDate">
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => updateField("dueDate", e.target.value)}
        />
      </FormField>

      {/* Prioridad y Estado - 1 columna en móvil, 2 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <FormField
          label={taskFormLabels.fields.priority.label}
          htmlFor="priority"
          required={taskFormLabels.fields.priority.required}
        >
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              updateField("priority", value as TaskPriority)
            }
            required
          >
            <SelectTrigger id="priority" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(priorityConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <span className={config.color}>{config.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label={taskFormLabels.fields.status.label}
          htmlFor="status"
          required={taskFormLabels.fields.status.required}
        >
          <Select
            value={formData.status}
            onValueChange={(value) =>
              updateField("status", value as TaskStatus)
            }
            required
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <span className={config.color}>{config.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      {/* Descripción */}
      <FormField
        label={taskFormLabels.fields.description.label}
        htmlFor="description"
      >
        <Textarea
          id="description"
          placeholder={taskFormLabels.fields.description.placeholder}
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={3}
          className="resize-none"
        />
      </FormField>
    </>
  );
}
