import { useState } from "react";
import { CreateDialog } from "@/components/ui/createDialog";
import { FormDialog } from "@/components/ui/formDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { CreateListDialog } from "@/components/createDialogs/createListDialog";
import { useCategories } from "@/hooks/useCategories";
import { useLists } from "@/hooks/useLists";
import { useAuth } from "@/hooks/useAuth";
import { taskFormLabels } from "@/config/taskConfig";
import type { Category } from "@/types/category/categories";
import type { List } from "@/types/list/list";

// Props para modo controlado
interface ControlledProps {
  mode: "controlled";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessibleLists: List[];
  onCreateCategory: (category: Category) => void;
  onOpenListDialog: () => void;
}

// Props para modo standalone
interface StandaloneProps {
  mode?: "standalone";
  trigger?: React.ReactNode;
}

type CreateCategoryDialogUnifiedProps = ControlledProps | StandaloneProps;

function CreateCategoryDialogUnified(props: CreateCategoryDialogUnifiedProps) {
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    listId: "",
  });

  const { createCategory } = useCategories();
  const { lists } = useLists();
  const { user } = useAuth();

  const isControlled = props.mode === "controlled";

  // En modo standalone, calculamos las listas accesibles
  const accessibleLists = isControlled
    ? props.accessibleLists
    : lists.filter((list) => list.ownerId === user?.id);

  const resetForm = () =>
    setFormData({ name: "", description: "", listId: "" });

  // Handler para abrir el diálogo de lista
  const handleOpenListDialog = () => {
    if (isControlled) {
      props.onOpenListDialog();
    } else {
      setListDialogOpen(true);
    }
  };

  // Handler para cuando se crea una lista (solo en modo standalone)
  const handleListCreated = () => {
    // La lista ya se creó en Redux vía el hook useLists
  };

  // Handler para modo standalone
  const handleStandaloneSubmit = () => {
    if (!formData.name.trim() || !formData.listId) return false;

    createCategory({
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      listId: formData.listId,
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
    if (!formData.name.trim() || !formData.listId) return;

    if (isControlled) {
      props.onCreateCategory({
        id: crypto.randomUUID(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        listId: formData.listId,
        createdAt: new Date().toISOString(),
        tasks: [],
        shares: [],
      });
    }

    resetForm();
    if (isControlled) {
      props.onOpenChange(false);
    }
  };

  const formFields = (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            onValueChange={(listId) => setFormData({ ...formData, listId })}
            onCreateNew={handleOpenListDialog}
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
        title={taskFormLabels.createCategory.title}
        description={taskFormLabels.createCategory.description}
        onSubmit={handleControlledSubmit}
        submitLabel={taskFormLabels.createCategory.submitButton}
        cancelLabel={taskFormLabels.createCategory.cancelButton}
        className="max-h-[85vh] sm:max-h-[90vh]"
      >
        {formFields}
      </FormDialog>
    );
  }

  // Modo standalone: usa CreateDialog
  return (
    <>
      <CreateDialog
        trigger={props.trigger}
        title={taskFormLabels.createCategory.title}
        description={taskFormLabels.createCategory.description}
        onSubmit={handleStandaloneSubmit}
        submitLabel={taskFormLabels.createCategory.submitButton}
        cancelLabel={taskFormLabels.createCategory.cancelButton}
      >
        {formFields}
      </CreateDialog>

      <CreateListDialog
        open={listDialogOpen}
        onOpenChange={setListDialogOpen}
        onCreateList={handleListCreated}
      />
    </>
  );
}

// Export por defecto: modo standalone
export default CreateCategoryDialogUnified;

// Export nombrado para modo controlado
export function CreateCategoryDialog(props: Omit<ControlledProps, "mode">) {
  return <CreateCategoryDialogUnified mode="controlled" {...props} />;
}

// Export nombrado para modo standalone (alias)
export function CreateCategoryDialogStandalone(props: {
  children?: React.ReactNode;
}) {
  return (
    <CreateCategoryDialogUnified mode="standalone" trigger={props.children} />
  );
}
