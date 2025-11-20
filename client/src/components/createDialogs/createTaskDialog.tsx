import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";
import { CreateCategoryDialog } from "@/components/createDialogs/createCategoryDialog";
import { CreateListDialog } from "@/components/createDialogs/createListDialog";
import { useTasks } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";
import { useLists } from "@/hooks/useLists";
import { useAuth } from "@/hooks/useAuth";
import {
  priorityConfig,
  statusConfig,
  taskFormLabels,
} from "@/config/taskConfig";
import type { Task, TaskPriority, TaskStatus } from "@/types/task/task";
import type { Category } from "@/types/category/categories";

export default function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const { createTask } = useTasks();
  const { accessibleCategories, createCategory } = useCategories();
  const { accessibleLists, createList } = useLists();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "MEDIUM" as TaskPriority,
    status: "PENDING" as TaskStatus,
    categoryId: "",
    dueDate: "",
    favorite: false,
  });

  const handleCategoryCreated = (category: Category) => {
    createCategory(category);
    setFormData({ ...formData, categoryId: category.id });
  };

  const handleListCreated = (
    listData: Omit<import("@/types/list/list").List, "id" | "createdAt" | "categories" | "shares">
  ) => {
    if (!user?.id) return;

    const newList = {
      id: crypto.randomUUID(),
      ...listData,
      ownerId: user.id,
      createdAt: new Date().toISOString(),
      categories: [],
      shares: [],
    };

    createList(newList);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.categoryId) {
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      categoryId: formData.categoryId,
      completed: formData.status === "COMPLETED",
      favorite: formData.favorite,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shares: [],
    };

    createTask(newTask);

    // Reset form
    setFormData({
      name: "",
      description: "",
      priority: "MEDIUM",
      status: "PENDING",
      categoryId: "",
      dueDate: "",
      favorite: false,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" leftIcon={taskFormLabels.createTask.icon}>
          {taskFormLabels.createTask.iconText}
        </Button>
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

        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {taskFormLabels.fields.name.label}{" "}
                {taskFormLabels.fields.name.required && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Input
                id="name"
                placeholder={taskFormLabels.fields.name.placeholder}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <Label htmlFor="category">
                {taskFormLabels.fields.category.label}{" "}
                {taskFormLabels.fields.category.required && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Combobox
                categories={accessibleCategories}
                value={formData.categoryId}
                onValueChange={(categoryId) =>
                  setFormData({ ...formData, categoryId })
                }
                onCreateNew={() => setCategoryDialogOpen(true)}
                placeholder={taskFormLabels.fields.category.placeholder}
                searchPlaceholder={taskFormLabels.fields.category.searchPlaceholder}
                emptyMessage={taskFormLabels.fields.category.emptyMessage}
                createNewLabel={taskFormLabels.fields.category.createNew}
              />
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">
                {taskFormLabels.fields.dueDate.label}
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">
                  {taskFormLabels.fields.priority.label}{" "}
                  {taskFormLabels.fields.priority.required && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      priority: value as TaskPriority,
                    })
                  }
                  required
                >
                  <SelectTrigger id="priority" className="w-full max-w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-w-full">
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className={config.color}>{config.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  {taskFormLabels.fields.status.label}{" "}
                  {taskFormLabels.fields.status.required && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as TaskStatus })
                  }
                  required
                >
                  <SelectTrigger id="status" className="w-full max-w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-w-full">
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className={config.color}>{config.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {taskFormLabels.fields.description.label}
            </Label>
            <Textarea
              id="description"
              placeholder={taskFormLabels.fields.description.placeholder}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
            />
          </div>

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
    </Dialog>
  );
}
