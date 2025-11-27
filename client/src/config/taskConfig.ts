/**
 * @file taskConfig.ts
 * @description Configuración de tareas, prioridades y estados.
 * Define las opciones y etiquetas para la gestión de tareas.
 */

export const taskFilterLabels = {
  statusPlaceholder: "Estado",
  statusAll: "Todos los Estados",
  priorityPlaceholder: "Prioridad",
  priorityAll: "Todas las Prioridades",
  sortPlaceholder: "Ordenar por",
  sortFields: {
    dueDate: "Fecha de Vencimiento",
    createdAt: "Fecha de Creación",
    name: "Nombre",
  },
  sortOrder: {
    asc: "Ascendente",
    desc: "Descendente",
  },
};

export const priorityConfig = {
  LOW: {
    color:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 [&_svg]:stroke-blue-600 dark:[&_svg]:stroke-blue-400",
    label: "Baja",
  },
  MEDIUM: {
    color:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 [&_svg]:stroke-yellow-600 dark:[&_svg]:stroke-yellow-400",
    label: "Media",
  },
  HIGH: {
    color:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 [&_svg]:stroke-orange-600 dark:[&_svg]:stroke-orange-400",
    label: "Alta",
  },
  URGENT: {
    color:
      "bg-red-500/10 text-red-600 dark:text-red-400 [&_svg]:stroke-red-600 dark:[&_svg]:stroke-red-400",
    label: "Urgente",
  },
} as const;

export const statusConfig = {
  PENDING: {
    color:
      "bg-gray-500/10 text-gray-600 dark:text-gray-400 [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-gray-400",
    label: "Pendiente",
  },
  IN_PROGRESS: {
    color:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 [&_svg]:stroke-blue-600 dark:[&_svg]:stroke-blue-400",
    label: "En Progreso",
  },
  COMPLETED: {
    color:
      "bg-green-500/10 text-green-600 dark:text-green-400 [&_svg]:stroke-green-600 dark:[&_svg]:stroke-green-400",
    label: "Completada",
  },
} as const;

export const taskFavoritesConfig = {
  FAVORITE: {
    color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    label: "Favorita",
  },
  NOT_FAVORITE: {
    color: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
    label: "No Favorita",
  },
} as const;

export const taskFormLabels = {
  createTask: {
    title: "Crear Nueva Tarea",
    description: "Completa los campos para crear una nueva tarea",
    submitButton: "Crear Tarea",
    cancelButton: "Cancelar",
  },
  createList: {
    title: "Nueva Lista",
    description: "Crea una nueva lista para organizar tus tareas",
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
    list: {
      label: "Lista",
      placeholder: "Selecciona una lista",
      searchPlaceholder: "Buscar lista...",
      emptyMessage: "No se encontró ninguna lista.",
      createNew: "Crear nueva lista",
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
    favorite: {
      label: "Favorita",
      required: false,
    },
    dueDate: {
      label: "Fecha de vencimiento",
      required: false,
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
    title: "Listas",
    emptyState: "No hay listas",
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
    list: {
      icon: "IconList",
      text: "Lista",
    },
  },
} as const;
