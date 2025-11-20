import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { CreateListDialog } from "@/components/createDialogs/createListDialog";
import { useCategories } from "@/hooks/useCategories";
import { useLists } from "@/hooks/useLists";
import { useAuth } from "@/hooks/useAuth";
import { taskFormLabels } from "@/config/taskConfig";
import type { Category } from "@/types/category/categories";

interface CreateCategoryDialogStandaloneProps {
  children?: React.ReactNode;
}

export default function CreateCategoryDialogStandalone({
  children,
}: CreateCategoryDialogStandaloneProps) {
  const [open, setOpen] = useState(false);
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    listId: "",
  });

  const { createCategory } = useCategories();
  const { lists } = useLists();
  const { user } = useAuth();

  const accessibleLists = lists.filter((list) => list.ownerId === user?.id);

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

    createCategory(newCategory);

    // Reset form
    setFormData({
      name: "",
      description: "",
      listId: "",
    });

    setOpen(false);
  };

  const handleListCreated = () => {
    // No need to do anything special here, the list will be added via Redux
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || <Button>Crear Categoría</Button>}
        </DialogTrigger>
        <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-3xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl">
              {taskFormLabels.createCategory.title}
            </DialogTitle>
            <DialogDescription>
              {taskFormLabels.createCategory.description}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
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
                  onCreateNew={() => setListDialogOpen(true)}
                  placeholder={taskFormLabels.fields.list.placeholder}
                  searchPlaceholder={
                    taskFormLabels.fields.list.searchPlaceholder
                  }
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
                placeholder={
                  taskFormLabels.fields.categoryDescription.placeholder
                }
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

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" size="lg">
                {taskFormLabels.createCategory.submitButton}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                size="lg"
              >
                {taskFormLabels.createCategory.cancelButton}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CreateListDialog
        open={listDialogOpen}
        onOpenChange={setListDialogOpen}
        onCreateList={handleListCreated}
      />
    </>
  );
}
