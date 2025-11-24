/**
 * @file dashboardConfig.ts
 * @description Configuración del panel de control de la aplicación de gestión de tareas.
 * Aquí se definen las tarjetas que se mostrarán en el dashboard, incluyendo
 * iconos, títulos, descripciones y detalles específicos para cada tarjeta.
 */

export const dashboardConfig = {
  title: "Panel de Control",
  welcome: "¡Bienvenido, ",
  description: "Resumen de tus tareas y estadísticas",
  noTasks: "No hay tareas para mostrar.",
};

export const dashboardCards = [
  {
    icon: "IconCalendar",
    title: "Próximas Tareas",
    description: "Vencen esta semana",
    bigDetails: true,
    span: "md:col-span-2 lg:col-span-1",
  },
  {
    icon: "IconBell",
    title: "Tareas Pendientes",
    description: "Esta semana",
    bigDetails: true,
    span: "md:col-span-2 lg:col-span-1",
  },
  {
    icon: "IconChecklist",
    title: "Tareas Completadas",
    description: "Esta semana",
    bigDetails: true,
    span: "md:col-span-2 lg:col-span-1",
  },
  {
    icon: "IconList",
    title: "Tareas Por Lista",
    description: "Distribución por lista",
    // chart: true,
    // chartType: "bar",
    span: "md:col-span-2 lg:col-span-1",
  },
  {
    icon: "IconChartBar",
    title: "Semana Actual",
    description: "Tareas de lunes a domingo",
    details: "Aquí aparecerán tus tareas de esta semana...",
    chart: true,
    chartType: "bar",
    span: "md:col-span-2 lg:col-span-2 row-span-2",
  },
  {
    icon: "IconChartPie",
    title: "Tareas Por Prioridad",
    description: "Distribución por prioridad",
    details: "Aquí aparecerán tus estadísticas de prioridad...",
    chart: true,
    chartType: "pie",
    span: "md:col-span-2 lg:col-span-1 row-span-2",
  },
  // {
  //   icon: "IconTask",
  //   title: "Más Tareas",
  //   description: "Historial de tareas",
  //   details: "Aquí aparecerán tus tareas más recientes...",
  //   span: "md:col-span-2 lg:col-span-1 row-span-2",
  // },
  {
    icon: "IconChartPie",
    title: "Tareas Por Estado",
    description: "Distribución por estado",
    details: "Aquí aparecerán tus estadísticas de estado...",
    chart: true,
    chartType: "pie",
    span: "md:col-span-2 lg:col-span-1 row-span-2",
  },
];
