import { Request, Response } from "express";
import prisma from "../database/database";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { handleServerError, sanitizeUser } from "../utils/utils";

export const createTestUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validación básica
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ error: "name, email y password son obligatorios" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      res.status(400).json({ error: "email inválido" });
      return;
    }

    // Hashear la contraseña antes de guardar
    const hashed = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: { email: String(email), name: String(name), password: hashed },
    });

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: sanitizeUser(user as Record<string, unknown>),
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Unique constraint failed
      res.status(409).json({ error: "El email ya está en uso" });
      return;
    }
    handleServerError(res, error, "Error al crear usuario");
  }
};

export const getTestUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({
      message: "Usuarios obtenidos exitosamente",
      users: users.map((u) => sanitizeUser(u as Record<string, unknown>)),
    });
  } catch (error) {
    handleServerError(res, error, "Error al obtener usuarios");
  }
};

export const deleteTestUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await prisma.user.deleteMany();
    res.status(200).json({
      message: "Usuarios eliminados exitosamente",
      deleted: result.count,
    });
  } catch (error) {
    handleServerError(res, error, "Error al eliminar usuarios");
  }
};

export const deleteTestUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(200).json({
      message: `Usuario con ID ${id} ha sido eliminado exitosamente`,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    handleServerError(res, error, "Error al eliminar usuario");
  }
};

export const getTestUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(404).json({ message: `Usuario con ID ${id} no encontrado` });
      return;
    }

    res.status(200).json({
      message: "Usuario obtenido exitosamente",
      user: sanitizeUser(user as Record<string, unknown>),
    });
  } catch (error) {
    handleServerError(res, error, "Error al obtener usuario");
  }
};
