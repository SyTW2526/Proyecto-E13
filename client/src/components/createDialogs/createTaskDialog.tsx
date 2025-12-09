import { CreateDialog } from "@/components/ui/createDialog";
import { TaskFormFields } from "@/components/forms/TaskFormFields";
import { CreateListDialog } from "@/components/createDialogs/createListDialog";
import { useTaskForm } from "@/hooks/useTaskForm";

import { useTranslation } from "react-i18next";
import type { Task } from "@/types/tasks-system/task";

interface CreateTaskDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  editTask?: Task;
  filterByEditPermission?: boolean;
  showCreateList?: boolean;
}

export default function CreateTaskDialog({
  children,
  open,
  onOpenChange,
  editTask,
  filterByEditPermission = false,
  showCreateList = true,
}: CreateTaskDialogProps) {
  const { t } = useTranslation();
  const {
    formData,
    updateField,
    accessibleLists,
    listDialogOpen,
    setListDialogOpen,
    handleListCreated,
    handleSubmit,
    resetForm,
  } = useTaskForm(editTask, { filterByEditPermission });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !editTask) {
      resetForm();
    }
    onOpenChange?.(isOpen);
  };

  const handleFormSubmit = () => {
    const success = handleSubmit(() => {
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
        title={editTask ? t("tasks.edit.title") : t("tasks.create.title")}
        description={
          editTask ? t("tasks.edit.description") : t("tasks.create.description")
        }
        onSubmit={handleFormSubmit}
        submitLabel={
          editTask ? t("tasks.edit.submit") : t("tasks.create.submit")
        }
        cancelLabel={t("tasks.create.cancel")}
      >
        <TaskFormFields
          formData={formData}
          updateField={updateField}
          accessibleLists={accessibleLists}
          onCreateList={() => setListDialogOpen(true)}
          showCreateList={showCreateList}
        />
      </CreateDialog>

      {showCreateList && (
        <CreateListDialog
          open={listDialogOpen}
          onOpenChange={setListDialogOpen}
          onCreateList={handleListCreated}
        />
      )}
    </>
  );
}
