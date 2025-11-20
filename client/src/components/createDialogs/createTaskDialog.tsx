import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskFormFields } from "@/components/forms/TaskFormFields";
import { CreateCategoryDialog } from "@/components/createDialogs/createCategoryDialog";
import { CreateListDialog } from "@/components/createDialogs/createListDialog";
import { useTaskForm } from "@/hooks/useTaskForm";
import { taskFormLabels } from "@/config/taskConfig";

interface CreateTaskDialogProps {
  children?: React.ReactNode;
}

export default function CreateTaskDialog({ children }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    formData,
    updateField,
    accessibleCategories,
    accessibleLists,
    categoryDialogOpen,
    setCategoryDialogOpen,
    listDialogOpen,
    setListDialogOpen,
    handleCategoryCreated,
    handleListCreated,
    handleSubmit,
  } = useTaskForm();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = handleSubmit(() => setOpen(false));
    if (!success) {
      // Podría mostrar un mensaje de error aquí
      console.error("Error al crear la tarea");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="secondary" leftIcon={taskFormLabels.createTask.icon}>
            {taskFormLabels.createTask.iconText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-3xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">
            {taskFormLabels.createTask.title}
          </DialogTitle>
          <DialogDescription>
            {taskFormLabels.createTask.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pb-4">
          <TaskFormFields
            formData={formData}
            updateField={updateField}
            accessibleCategories={accessibleCategories}
            onCreateCategory={() => setCategoryDialogOpen(true)}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" size="lg">
              {taskFormLabels.createTask.submitButton}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              size="lg"
            >
              {taskFormLabels.createTask.cancelButton}
            </Button>
          </div>
        </form>
      </DialogContent>

      <CreateCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        accessibleLists={accessibleLists}
        onCreateCategory={handleCategoryCreated}
        onOpenListDialog={() => setListDialogOpen(true)}
      />

      <CreateListDialog
        open={listDialogOpen}
        onOpenChange={setListDialogOpen}
        onCreateList={handleListCreated}
      />
    </Dialog>
  );
}
