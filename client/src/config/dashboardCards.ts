/**
 * @file dashboardCards.ts
 * @description Configuración de las tarjetas del panel de control.
 * Define las tarjetas que se mostrarán en el panel de control.
 */
export const dashboardCards = [
  {
    icon: "IconBell",
    title: "Tareas Pendientes",
    description: "Por completar",
    details: "5",
    bigDetails: true,
    span: "md:col-span-2 lg:col-span-1",
  },
  {
    icon: "IconChecklist",
    title: "Tareas Completadas",
    description: "Esta semana",
    details: "12",
    bigDetails: true,
    span: "md:col-span-2 lg:col-span-1",
  },
  {
    icon: "IconTags",
    title: "Categorías",
    description: "Proyectos activos",
    details: "3",
    bigDetails: true,
    span: "md:col-span-2 lg:col-span-1",
  },
  {
    icon: "IconCalendar",
    title: "Próximas Tareas",
    description: "En los próximos días",
    details: "4",
    bigDetails: true,
    span: "md:col-span-2 lg:col-span-1",
  },
  {
    icon: "IconTask",
    title: "Más Tareas",
    description: "Historial de tareas",
    details: "Aquí aparecerán tus tareas más recientes...",
    span: "md:col-span-2 lg:col-span-2 row-span-2",
  },
  {
    icon: "IconChartBar",
    title: "Progreso Semanal",
    description: "Resumen de la semana",
    details: "Aquí aparecerán tus estadísticas de progreso...",
    span: "md:col-span-2 lg:col-span-2 row-span-2",
  },
];
