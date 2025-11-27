import { useState, useEffect } from "react";
import { FormDialog } from "@/components/ui/formDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLists } from "@/hooks/useLists";
import { taskFormLabels } from "@/config/taskConfig";
import type { List } from "@/types/tasks-system/list";

interface EditListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  list: List;
}

export default function EditListDialog({
  open,
  onOpenChange,
  list,
}: EditListDialogProps) {
  const [formData, setFormData] = useState({
    name: list.name,
    description: list.description || "",
  });
  const { editList } = useLists();

  useEffect(() => {
    if (open) {
      setFormData({
        name: list.name,
        description: list.description || "",
      });
    }
  }, [open, list]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    editList({
      id: list.id,
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    });

    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Lista"
      description="Modifica los detalles de la lista."
      onSubmit={handleSubmit}
      submitLabel="Guardar cambios"
      cancelLabel="Cancelar"
      className="max-h-[85vh] sm:max-h-[90vh]"
    >
      <div className="space-y-2">
        <Label htmlFor="editListName">
          {taskFormLabels.fields.listName.label}{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="editListName"
          placeholder={taskFormLabels.fields.listName.placeholder}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="editListDescription">
          {taskFormLabels.fields.listDescription.label}
        </Label>
        <Textarea
          id="editListDescription"
          placeholder={taskFormLabels.fields.listDescription.placeholder}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={2}
        />
      </div>
    </FormDialog>
  );
}
