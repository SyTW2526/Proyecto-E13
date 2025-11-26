import { Request, Response } from "express";
import prisma from "../database/prisma";

export const createList = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const ownerId = req.user?.id;

    if (!ownerId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const list = await prisma.list.create({
      data: {
        name,
        description,
        ownerId,
      },
      include: {
        shares: true,
        tasks: true,
      },
    });
    return res.json(list);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating list" });
  }
};

export const deleteList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const list = await prisma.list.delete({
      where: {
        id,
      },
    });
    return res.json(list);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting list" });
  }
};

export const getUserLists = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const lists = await prisma.list.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        shares: true,
        tasks: true,
      },
    });
    return res.json(lists);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error getting lists" });
  }
};
