import { Request, Response } from "express";
import prisma from "../database/database";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userID = req.user?.id;
    const { id } = req.params;

    if (!userID || userID !== id) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this user" });
    }

    const user = await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "User deleted", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
