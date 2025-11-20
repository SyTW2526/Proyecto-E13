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
import { useTasks } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";
import { useLists } from "@/hooks/useLists";
import { IconPlus } from "@tabler/icons-react";
import {
  priorityConfig,
  statusConfig,
  taskFormLabels,
} from "@/config/taskConfig";
import type { Task, TaskPriority, TaskStatus } from "@/types/task/task";
import type { Category } from "@/types/category/categories";

export default function CreateTaskSheet() {
  const [open, setOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const { createTask } = useTasks();
  const { accessibleCategories, createCategory } = useCategories();
  const { accessibleLists } = useLists();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "MEDIUM" as TaskPriority,
    status: "PENDING" as TaskStatus,
    categoryId: "",
    dueDate: "",
    favorite: false,
  });

  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    description: "",
    listId: "",
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryData.name.trim() || !newCategoryData.listId) {
      return;
    }

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryData.name.trim(),
      description: newCategoryData.description.trim() || undefined,
      listId: newCategoryData.listId,
      createdAt: new Date().toISOString(),
      tasks: [],
      shares: [],
    };

    createCategory(newCategory);

    // Seleccionar automáticamente la nueva categoría
    setFormData({ ...formData, categoryId: newCategory.id });

    // Reset category form
    setNewCategoryData({
      name: "",
      description: "",
      listId: "",
    });

    setCategoryDialogOpen(false);
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
        <Button size="sm" className="gap-2">
          <IconPlus className="h-4 w-4" />
          Nueva Tarea
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
              />
            </div>
          </div>

          <Dialog
            open={categoryDialogOpen}
            onOpenChange={setCategoryDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{taskFormLabels.createCategory.title}</DialogTitle>
                <DialogDescription>
                  {taskFormLabels.createCategory.description}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateCategory} className="space-y-4">
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
                    value={newCategoryData.name}
                    onChange={(e) =>
                      setNewCategoryData({
                        ...newCategoryData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
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
                    value={newCategoryData.description}
                    onChange={(e) =>
                      setNewCategoryData({
                        ...newCategoryData,
                        description: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryList">
                    {taskFormLabels.fields.list.label}{" "}
                    {taskFormLabels.fields.list.required && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Select
                    value={newCategoryData.listId}
                    onValueChange={(value) =>
                      setNewCategoryData({
                        ...newCategoryData,
                        listId: value,
                      })
                    }
                    required
                  >
                    <SelectTrigger id="categoryList">
                      <SelectValue
                        placeholder={taskFormLabels.fields.list.placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {accessibleLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">
                    {taskFormLabels.createCategory.submitButton}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCategoryDialogOpen(false)}
                  >
                    {taskFormLabels.createCategory.cancelButton}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

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
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
