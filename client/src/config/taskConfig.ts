/**
 * @file taskConfig.ts
 * @description Configuración de tareas, prioridades y estados.
 * Define las opciones y etiquetas para la gestión de tareas.
 */

export const priorityConfig = {
  LOW: {
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    label: "Baja",
  },
  MEDIUM: {
    color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    label: "Media",
  },
  HIGH: {
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    label: "Alta",
  },
  URGENT: {
    color: "bg-red-500/10 text-red-700 dark:text-red-400",
    label: "Urgente",
  },
} as const;

export const statusConfig = {
  PENDING: {
    color: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
    label: "Pendiente",
  },
  IN_PROGRESS: {
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    label: "En Progreso",
  },
  COMPLETED: {
    color: "bg-green-500/10 text-green-700 dark:text-green-400",
    label: "Completada",
  },
} as const;

export const taskFormLabels = {
  createTask: {
    title: "Crear Nueva Tarea",
    description: "Completa los campos para crear una nueva tarea",
    icon: "IconPlus",
    iconText: "Nueva Tarea",
    submitButton: "Crear Tarea",
    cancelButton: "Cancelar",
  },
  createCategory: {
    title: "Nueva Categoría",
    description: "Crea una nueva categoría para organizar tus tareas",
    submitButton: "Crear Categoría",
    cancelButton: "Cancelar",
  },
  createList: {
    title: "Nueva Lista",
    description: "Crea una nueva lista para organizar tus categorías",
    submitButton: "Crear Lista",
    cancelButton: "Cancelar",
  },
  fields: {
    name: {
      label: "Nombre",
      placeholder: "Nombre de la tarea",
      required: true,
    },
    description: {
      label: "Descripción",
      placeholder: "Descripción de la tarea (opcional)",
      required: false,
    },
    category: {
      label: "Categoría",
      placeholder: "Selecciona una categoría",
      searchPlaceholder: "Buscar categoría...",
      emptyMessage: "No se encontró ninguna categoría.",
      createNew: "Crear nueva categoría",
      required: true,
    },
    priority: {
      label: "Prioridad",
      required: false,
    },
    status: {
      label: "Estado",
      required: false,
    },
    dueDate: {
      label: "Fecha de vencimiento",
      required: false,
    },
    categoryName: {
      label: "Nombre",
      placeholder: "Nombre de la categoría",
      required: true,
    },
    categoryDescription: {
      label: "Descripción",
      placeholder: "Descripción (opcional)",
      required: false,
    },
    list: {
      label: "Lista",
      placeholder: "Selecciona una lista",
      searchPlaceholder: "Buscar lista...",
      emptyMessage: "No se encontró ninguna lista.",
      createNew: "Crear nueva lista",
      required: true,
    },
    listName: {
      label: "Nombre",
      placeholder: "Nombre de la lista",
      required: true,
    },
    listDescription: {
      label: "Descripción",
      placeholder: "Descripción (opcional)",
      required: false,
    },
  },
} as const;

export const tasksPageLabels = {
  title: "Mis Tareas",
  taskCount: {
    singular: "tarea",
    plural: "tareas",
    suffix: "en total",
  },
  emptyState: "No hay tareas disponibles",
  sidebar: {
    title: "Categorías",
    emptyState: "No hay categorías",
  },
  taskCard: {
    createdLabel: "Creada:",
    dueLabel: "Vence:",
    noDate: "Sin fecha",
  },
  createButtons: {
    task: {
      icon: "IconTask",
      text: "Tarea",
    },
    category: {
      icon: "IconCategory",
      text: "Categoría",
    },
    list: {
      icon: "IconList",
      text: "Lista",
    },
  },
} as const;
