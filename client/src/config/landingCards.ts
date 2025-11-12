/**
 * @file landingCards.ts
 * @description Configuración de las tarjetas de la página de inicio.
 * Define las tarjetas que se mostrarán en la página de inicio.
 */
export const landingCards = [
  {
    // use the icon component name as a string and resolve it dynamically where needed
    icon: "IconClipboard",
    title: "Gestión de tareas inteligente",
    description: "Crea, organiza y prioriza tareas con facilidad",
    details:
      "Listas, subtareas, fechas de entrega y prioridades en una vista clara. Completa tareas más rápido con acciones rápidas y plantillas reutilizables.",
    span: "md:col-span-2 lg:col-span-2",
  },
  {
    icon: "IconBell",
    title: "Notificaciones inteligentes",
    description: "Recordatorios configurables y alertas oportunas",
    details:
      "Recibe avisos por plazos, recordatorios recurrentes y notificaciones push o por correo. Configura la frecuencia y silencia en momentos de concentración.",
  },
  {
    icon: "IconFolder",
    title: "Proyectos y categorías",
    description: "Organiza tu trabajo por proyectos y equipos",
    details:
      "Agrupa tareas por proyecto, usa carpetas y etiquetas personalizadas. Comparte vistas y permisos para colaborar sin perder el control.",
  },
  {
    icon: "IconPalette",
    title: "Personalización y accesibilidad",
    description: "Temas, modos y vistas adaptadas a tu flujo",
    details:
      "Soporte para modo claro/oscuro, ajustes de densidad y esquemas de color. Personaliza atajos y la disposición para adaptar la app a tu forma de trabajar.",
  },
  {
    icon: "IconUsers",
    title: "Colaboración en equipo",
    description: "Asignación, comentarios y seguimiento de actividad",
    details:
      "Trabaja en equipo con asignaciones, menciones y un feed de actividad centralizado.",
  },
];
