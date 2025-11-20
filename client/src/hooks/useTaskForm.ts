import { useState, useCallback } from "react";
import { useTasks } from "./useTasks";
import { useCategories } from "./useCategories";
import { useLists } from "./useLists";
import { useAuth } from "./useAuth";
import type { Task, TaskPriority, TaskStatus } from "@/types/task/task";
import type { Category } from "@/types/category/categories";
import type { List } from "@/types/list/list";

interface TaskFormData {
  name: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  categoryId: string;
  dueDate: string;
  favorite: boolean;
}

const initialFormData: TaskFormData = {
  name: "",
  description: "",
  priority: "MEDIUM",
  status: "PENDING",
  categoryId: "",
  dueDate: "",
  favorite: false,
};

export function useTaskForm() {
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [listDialogOpen, setListDialogOpen] = useState(false);

  const { createTask } = useTasks();
  const { accessibleCategories, createCategory } = useCategories();
  const { accessibleLists, createList } = useLists();
  const { user } = useAuth();

  const updateField = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const handleCategoryCreated = useCallback(
    (category: Category) => {
      createCategory(category);
      updateField("categoryId", category.id);
    },
    [createCategory, updateField],
  );

  const handleListCreated = useCallback(
    (listData: Omit<List, "id" | "createdAt" | "categories" | "shares">) => {
      if (!user?.id) return;

      const newList: List = {
        id: crypto.randomUUID(),
        ...listData,
        ownerId: user.id,
        createdAt: new Date().toISOString(),
        categories: [],
        shares: [],
      };

      createList(newList);
    },
    [user, createList],
  );

  const handleSubmit = useCallback(
    (onSuccess?: () => void) => {
      if (!formData.name.trim() || !formData.categoryId) {
        return false;
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
      resetForm();
      onSuccess?.();
      return true;
    },
    [formData, createTask, resetForm],
  );

  return {
    formData,
    updateField,
    resetForm,
    accessibleCategories,
    accessibleLists,
    categoryDialogOpen,
    setCategoryDialogOpen,
    listDialogOpen,
    setListDialogOpen,
    handleCategoryCreated,
    handleListCreated,
    handleSubmit,
  };
}
