import { Request, Response } from "express";
import prisma from "../database/database";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export const register = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email });

    return res.status(201).json({ user, token });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "A user with this email already exists." });
    }
    return res.status(500).json({ error: "Error creating user." });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid email." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Wrong password." });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    return res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    return res.status(500).json({ error: "Error logging in user." });
  }
};
