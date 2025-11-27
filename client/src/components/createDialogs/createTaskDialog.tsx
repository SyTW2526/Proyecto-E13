import { CreateDialog } from "@/components/ui/createDialog";
import { TaskFormFields } from "@/components/forms/TaskFormFields";
import { CreateListDialog } from "@/components/createDialogs/createListDialog";
import { useTaskForm } from "@/hooks/useTaskForm";
import { taskFormLabels } from "@/config/taskConfig";
import type { Task } from "@/types/tasks-system/task";

interface CreateTaskDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  editTask?: Task;
}

export default function CreateTaskDialog({
  children,
  open,
  onOpenChange,
  editTask,
}: CreateTaskDialogProps) {
  const {
    formData,
    updateField,
    accessibleLists,
    listDialogOpen,
    setListDialogOpen,
    handleListCreated,
    handleSubmit,
    resetForm,
  } = useTaskForm(editTask);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !editTask) {
      resetForm();
    }
    onOpenChange?.(isOpen);
  };

  const handleFormSubmit = () => {
    const success = handleSubmit(() => {
      // Cerrar el diálogo después de enviar exitosamente
      handleOpenChange(false);
    });
    return success;
  };

  return (
    <>
      <CreateDialog
        trigger={children}
        open={open}
        onOpenChange={handleOpenChange}
        title={editTask ? "Editar Tarea" : taskFormLabels.createTask.title}
        description={
          editTask
            ? "Modifica los campos para editar la tarea"
            : taskFormLabels.createTask.description
        }
        onSubmit={handleFormSubmit}
        submitLabel={
          editTask ? "Guardar Cambios" : taskFormLabels.createTask.submitButton
        }
        cancelLabel={taskFormLabels.createTask.cancelButton}
      >
        <TaskFormFields
          formData={formData}
          updateField={updateField}
          accessibleLists={accessibleLists}
          onCreateList={() => setListDialogOpen(true)}
        />
      </CreateDialog>

      <CreateListDialog
        open={listDialogOpen}
        onOpenChange={setListDialogOpen}
        onCreateList={handleListCreated}
      />
    </>
  );
}
