import { Request, Response } from "express";
import prisma from "../database/prisma";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { name, description, status, listId, priority, dueDate } = req.body;
    const task = await prisma.task.create({
      data: {
        name,
        description,
        status,
        listId,
        priority,
        dueDate,
      },
    });
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.delete({
      where: {
        id,
      },
    });
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting task" });
  }
};

export const getUserTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const tasks = await prisma.task.findMany({
      where: {
        list: {
          ownerId: userId
        },
      },
    });
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error getting tasks" });
  }
};
