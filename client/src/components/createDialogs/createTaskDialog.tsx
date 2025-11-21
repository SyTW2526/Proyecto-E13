import { CreateDialog } from "@/components/ui/createDialog";
import { TaskFormFields } from "@/components/forms/TaskFormFields";
import { CreateCategoryDialog } from "@/components/createDialogs/createCategoryDialog";
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
          accessibleCategories={accessibleCategories}
          onCreateCategory={() => setCategoryDialogOpen(true)}
        />
      </CreateDialog>

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
    </>
  );
}
