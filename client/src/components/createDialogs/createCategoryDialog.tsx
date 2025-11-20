import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormDialog } from "@/components/ui/formDialog";
import { Combobox } from "@/components/ui/combobox";
import { taskFormLabels } from "@/config/taskConfig";
import type { Category } from "@/types/category/categories";
import type { List } from "@/types/list/list";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessibleLists: List[];
  onCreateCategory: (category: Category) => void;
  onOpenListDialog: () => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  accessibleLists,
  onCreateCategory,
  onOpenListDialog,
}: CreateCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    listId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.listId) {
      return;
    }

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      listId: formData.listId,
      createdAt: new Date().toISOString(),
      tasks: [],
      shares: [],
    };

    onCreateCategory(newCategory);

    // Reset form
    setFormData({
      name: "",
      description: "",
      listId: "",
    });

    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={taskFormLabels.createCategory.title}
      description={taskFormLabels.createCategory.description}
      onSubmit={handleSubmit}
      submitLabel={taskFormLabels.createCategory.submitButton}
      cancelLabel={taskFormLabels.createCategory.cancelButton}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryName">
            {taskFormLabels.fields.categoryName.label}{" "}
            {taskFormLabels.fields.categoryName.required && (
              <span className="text-red-500">*</span>
            )}
          </Label>
          <Input
            id="categoryName"
            placeholder={taskFormLabels.fields.categoryName.placeholder}
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
          <Label htmlFor="categoryList">
            {taskFormLabels.fields.list.label}{" "}
            {taskFormLabels.fields.list.required && (
              <span className="text-red-500">*</span>
            )}
          </Label>
          <Combobox
            categories={accessibleLists.map((list) => ({
              id: list.id,
              name: list.name,
            }))}
            value={formData.listId}
            onValueChange={(listId) =>
              setFormData({
                ...formData,
                listId,
              })
            }
            onCreateNew={onOpenListDialog}
            placeholder={taskFormLabels.fields.list.placeholder}
            searchPlaceholder={taskFormLabels.fields.list.searchPlaceholder}
            emptyMessage={taskFormLabels.fields.list.emptyMessage}
            createNewLabel={taskFormLabels.fields.list.createNew}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryDescription">
          {taskFormLabels.fields.categoryDescription.label}
        </Label>
        <Textarea
          id="categoryDescription"
          placeholder={taskFormLabels.fields.categoryDescription.placeholder}
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
