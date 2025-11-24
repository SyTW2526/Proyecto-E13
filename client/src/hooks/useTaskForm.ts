import { useState, useCallback, useEffect } from "react";
import { useTasks } from "./useTasks";
import { useLists } from "./useLists";
import { useAuth } from "./useAuth";
import type { Task, TaskPriority, TaskStatus } from "@/types/tasks-system/task";
import type { List } from "@/types/tasks-system/list";

interface TaskFormData {
  name: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  listId: string;
  dueDate: string;
  favorite: boolean;
}

const initialFormData: TaskFormData = {
  name: "",
  description: "",
  priority: "MEDIUM",
  status: "PENDING",
  listId: "",
  dueDate: "",
  favorite: false,
};

export function useTaskForm() {
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [listDialogOpen, setListDialogOpen] = useState(false);

  const { createTask } = useTasks();
  const { accessibleLists, createList } = useLists();
  const { user } = useAuth();

  // Establecer la primera lista por defecto si existe y no hay ninguna seleccionada
  useEffect(() => {
    if (accessibleLists.length > 0 && !formData.listId) {
      setFormData((prev) => ({ ...prev, listId: accessibleLists[0].id }));
    }
  }, [accessibleLists, formData.listId]);

  const updateField = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const handleListCreated = useCallback(
    (listData: Omit<List, "id" | "createdAt" | "shares" | "tasks">) => {
      if (!user?.id) return;

      const newList: List = {
        id: crypto.randomUUID(),
        ...listData,
        ownerId: user.id,
        createdAt: new Date().toISOString(),
        tasks: [],
        shares: [],
      };

      createList(newList);
      updateField("listId", newList.id);
    },
    [user, createList, updateField],
  );

  const handleSubmit = useCallback(
    (onSuccess?: () => void) => {
      if (!formData.name.trim() || !formData.listId) {
        return false;
      }

      const newTask: Task = {
        id: crypto.randomUUID(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        listId: formData.listId,
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
    accessibleLists,
    listDialogOpen,
    setListDialogOpen,
    handleListCreated,
    handleSubmit,
  };
}
