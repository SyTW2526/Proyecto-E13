import { useState } from "react";
import { CreateDialog } from "@/components/ui/createDialog";
import { FormDialog } from "@/components/ui/formDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLists } from "@/hooks/useLists";
import { useAuth } from "@/hooks/useAuth";
import { taskFormLabels } from "@/config/taskConfig";
import type { List } from "@/types/tasks-system/list";

// Props para modo controlado (usado como diálogo anidado)
interface ControlledProps {
  mode: "controlled";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateList: (list: Omit<List, "id" | "createdAt" | "tasks" | "shares">) => void;
}

// Props para modo standalone (usado como componente independiente)
interface StandaloneProps {
  mode?: "standalone";
  trigger?: React.ReactNode;
}

type CreateListDialogUnifiedProps = ControlledProps | StandaloneProps;

function CreateListDialogUnified(props: CreateListDialogUnifiedProps) {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { createList } = useLists();
  const { user } = useAuth();

  const isControlled = props.mode === "controlled";

  const resetForm = () => setFormData({ name: "", description: "" });

  // Handler para modo standalone
  const handleStandaloneSubmit = () => {
    if (!formData.name.trim() || !user?.id) return false;

    createList({
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      ownerId: user.id,
      createdAt: new Date().toISOString(),
      tasks: [],
      shares: [],
    });

    resetForm();
    return true;
  };

  // Handler para modo controlado
  const handleControlledSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (isControlled) {
      props.onCreateList({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        ownerId: "",
      });
    }

    resetForm();
    if (isControlled) {
      props.onOpenChange(false);
    }
  };

  const formFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="listName">
          {taskFormLabels.fields.listName.label}{" "}
          {taskFormLabels.fields.listName.required && (
            <span className="text-red-500">*</span>
          )}
        </Label>
        <Input
          id="listName"
          placeholder={taskFormLabels.fields.listName.placeholder}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="listDescription">
          {taskFormLabels.fields.listDescription.label}
        </Label>
        <Textarea
          id="listDescription"
          placeholder={taskFormLabels.fields.listDescription.placeholder}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={2}
        />
      </div>
    </>
  );

  // Modo controlado: usa FormDialog
  if (isControlled) {
    return (
      <FormDialog
        open={props.open}
        onOpenChange={props.onOpenChange}
        title={taskFormLabels.createList.title}
        description={taskFormLabels.createList.description}
        onSubmit={handleControlledSubmit}
        submitLabel={taskFormLabels.createList.submitButton}
        cancelLabel={taskFormLabels.createList.cancelButton}
        className="max-h-[85vh] sm:max-h-[90vh]"
      >
        {formFields}
      </FormDialog>
    );
  }

  // Modo standalone: usa CreateDialog
  return (
    <CreateDialog
      trigger={props.trigger}
      title={taskFormLabels.createList.title}
      description={taskFormLabels.createList.description}
      onSubmit={handleStandaloneSubmit}
      submitLabel={taskFormLabels.createList.submitButton}
      cancelLabel={taskFormLabels.createList.cancelButton}
    >
      {formFields}
    </CreateDialog>
  );
}

// Export por defecto: modo standalone
export default CreateListDialogUnified;

// Export nombrado para modo controlado
export function CreateListDialog(props: Omit<ControlledProps, "mode">) {
  return <CreateListDialogUnified mode="controlled" {...props} />;
}

// Export nombrado para modo standalone (alias)
export function CreateListDialogStandalone(props: {
  children?: React.ReactNode;
}) {
  return <CreateListDialogUnified mode="standalone" trigger={props.children} />;
}
