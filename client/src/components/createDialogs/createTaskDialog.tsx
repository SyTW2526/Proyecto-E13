import { CreateDialog } from "@/components/ui/createDialog";
import { TaskFormFields } from "@/components/forms/TaskFormFields";
import { CreateListDialog } from "@/components/createDialogs/createListDialog";
import { useTaskForm } from "@/hooks/useTaskForm";
import { taskFormLabels } from "@/config/taskConfig";

interface CreateTaskDialogProps {
  children?: React.ReactNode;
}

export default function CreateTaskDialog({ children }: CreateTaskDialogProps) {
  const {
    formData,
    updateField,
    accessibleLists,
    listDialogOpen,
    setListDialogOpen,
    handleListCreated,
    handleSubmit,
  } = useTaskForm();

  return (
    <>
      <CreateDialog
        trigger={children}
        title={taskFormLabels.createTask.title}
        description={taskFormLabels.createTask.description}
        onSubmit={() => handleSubmit()}
        submitLabel={taskFormLabels.createTask.submitButton}
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
