import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../database/prisma";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailNotifications: true,
        pushNotifications: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateName = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateEmailNotificationSetting = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const { emailNotifications } = req.body as {
      emailNotifications?: boolean;
    };

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (typeof emailNotifications !== "boolean") {
      return res
        .status(400)
        .json({ error: "emailNotifications must be a boolean" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailNotifications },
      select: {
        id: true,
        emailNotifications: true,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating email notification setting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePushNotificationSetting = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const { pushNotifications } = req.body as {
      pushNotifications?: boolean;
    };

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (typeof pushNotifications !== "boolean") {
      return res
        .status(400)
        .json({ error: "pushNotifications must be a boolean" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { pushNotifications },
      select: {
        id: true,
        pushNotifications: true,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating push notification setting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "User not found" });
      }
    }
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
