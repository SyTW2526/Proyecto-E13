import { Request, Response } from "express";
import prisma from "../database/database";
import { Prisma } from "@prisma/client";
import { handleServerError } from "../utils/utils";

export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description, categoryId, dueDate, priority, status } =
      req.body;

    if (!name || !categoryId) {
      res.status(400).json({ error: "name y categoryId son obligatorios" });
      return;
    }

    const task = await prisma.task.create({
      data: {
        name: String(name),
        description: description ? String(description) : undefined,
        categoryId: String(categoryId),
        dueDate: dueDate ? new Date(String(dueDate)) : undefined,
        priority: priority ? (priority as any) : undefined,
        status: status ? (status as any) : undefined,
      },
    });

    res.status(201).json({ message: "Tarea creada", task });
  } catch (error) {
    handleServerError(res, error, "Error al crear tarea");
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, categoryId } = req.query as Record<
      string,
      string | undefined
    >;
    const where: any = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    const tasks = await prisma.task.findMany({ where });

    res.status(200).json({ message: "Tareas obtenidas", tasks });
  } catch (error) {
    handleServerError(res, error, "Error al obtener tareas");
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      res.status(404).json({ message: `Tarea con ID ${id} no encontrada` });
      return;
    }

    res.status(200).json({ message: "Tarea obtenida", task });
  } catch (error) {
    handleServerError(res, error, "Error al obtener tarea");
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      status,
      priority,
      dueDate,
      completed,
      categoryId,
    } = req.body;

    const data: any = {};
    if (typeof name !== "undefined") data.name = String(name);
    if (typeof description !== "undefined") data.description = description;
    if (typeof status !== "undefined") data.status = status;
    if (typeof priority !== "undefined") data.priority = priority;
    if (typeof dueDate !== "undefined")
      data.dueDate = dueDate ? new Date(String(dueDate)) : null;
    if (typeof categoryId !== "undefined") data.categoryId = String(categoryId);

    if (typeof completed !== "undefined") {
      data.completed = !!completed;
      data.completedAt = completed ? new Date() : null;
    }

    const task = await prisma.task.update({
      where: { id },
      data,
    });

    res.status(200).json({ message: "Tarea actualizada", task });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }
    handleServerError(res, error, "Error al actualizar tarea");
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.status(200).json({ message: `Tarea con ID ${id} eliminada` });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }
    handleServerError(res, error, "Error al eliminar tarea");
  }
};
