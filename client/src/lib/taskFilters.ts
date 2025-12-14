import type { Task } from "@/types/tasks-system/task";

/**
 * Filtra una cadena por una fecha válida y devuelve un objeto Date o null si no es válida.
 * @param value Cadena de fecha en formato ISO o similar.
 * @return Objeto Date o null.
 */
function parseDate(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Número de tareas completadas en los últimos `days` días.
 * Por defecto, cuenta la última semana.
 */
export function getCompletedTasksLastNDays(
  tasks: Task[],
  days: number = 7,
): number {
  if (days <= 0) return 0;

  const now = new Date();
  const from = new Date();
  from.setDate(now.getDate() - days);

  return tasks.filter((task) => {
    if (!task.completed || !task.completedAt) return false;
    const completedAt = parseDate(task.completedAt);
    if (!completedAt) return false;
    return completedAt >= from && completedAt <= now;
  }).length;
}

/**
 * Devuelve las tareas con fecha de vencimiento más próxima.
 * Solo tiene en cuenta tareas con dueDate válido y futuro/actual.
 * Ordena de más cercano a más lejano.
 * Limita el resultado a `limit` tareas (por defecto 5).
 */
export function getNextDueTasks(tasks: Task[], limit: number = 5): Task[] {
  const now = new Date();

  return tasks
    .map((task) => {
      const due = parseDate(task.dueDate);
      return { task, due };
    })
    .filter((entry): entry is { task: Task; due: Date } => entry.due !== null)
    .filter(({ due }) => due >= now)
    .sort((a, b) => a.due.getTime() - b.due.getTime())
    .slice(0, limit)
    .map(({ task }) => task);
}

/**
 * Devuelve las tareas más recientes según `createdAt`,
 * ordenadas de más nueva a más antigua.
 * Limita el resultado a `limit` tareas (por defecto 5).
 */
export function getMostRecentTasks(tasks: Task[], limit: number = 5): Task[] {
  return [...tasks]
    .map((task) => {
      const created = parseDate(task.createdAt) ?? new Date(0);
      return { task, created };
    })
    .sort((a, b) => b.created.getTime() - a.created.getTime())
    .slice(0, limit)
    .map(({ task }) => task);
}

/**
 * Devuelve las tareas marcadas como favoritas.
 */
export function getFavoriteTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.favorite === true);
}