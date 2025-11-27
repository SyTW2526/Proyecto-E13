import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  TaskPriorityFilter,
  TaskStatusFilter,
} from "@/components/tasks/TaskFilters";
import { Combobox } from "@/components/ui/combobox";
import { FormField } from "./FormField";
import { taskFormLabels } from "@/config/taskConfig";
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

      {/* Prioridad y Estado - 1 columna en móvil, 2 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Fecha de vencimiento */}
        <FormField
          label={taskFormLabels.fields.dueDate.label}
          htmlFor="dueDate"
        >
          <Input
            id="dueDate"
            type="date"
            min={new Date(Date.now()).toISOString().split("T")[0]}
            value={formData.dueDate}
            onChange={(e) => updateField("dueDate", e.target.value)}
          />
        </FormField>

        <FormField
          label={taskFormLabels.fields.priority.label}
          htmlFor="priority"
          required={taskFormLabels.fields.priority.required}
        >
          <TaskPriorityFilter
            value={formData.priority}
            onChange={(value) => updateField("priority", value)}
            showAll={false}
            className="w-full"
          />
        </FormField>

        <FormField
          label={taskFormLabels.fields.status.label}
          htmlFor="status"
          required={taskFormLabels.fields.status.required}
        >
          <TaskStatusFilter
            value={formData.status}
            onChange={(value) => updateField("status", value)}
            showAll={false}
            className="w-full"
          />
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
