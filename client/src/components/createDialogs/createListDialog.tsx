import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormDialog } from "@/components/ui/formDialog";
import { taskFormLabels } from "@/config/taskConfig";
import type { List } from "@/types/list/list";

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateList: (
    list: Omit<List, "id" | "createdAt" | "categories" | "shares">,
  ) => void;
}

export function CreateListDialog({
  open,
  onOpenChange,
  onCreateList,
}: CreateListDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    onCreateList({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      ownerId: "", // Will be set by parent
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
    });

    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={taskFormLabels.createList.title}
      description={taskFormLabels.createList.description}
      onSubmit={handleSubmit}
      submitLabel={taskFormLabels.createList.submitButton}
      cancelLabel={taskFormLabels.createList.cancelButton}
    >
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
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
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
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
          rows={2}
        />
      </div>
    </FormDialog>
  );
}
