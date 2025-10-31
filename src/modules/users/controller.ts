import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword, generateToken } from "../../utils/auth";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name, phone },
    });

    const token = generateToken(user.id);
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(user.id);
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, phone: true, tier: true, points: true },
    });
    return res.json({ user });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, phone, dateOfBirth } = req.body;
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name, phone, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined },
    });
    return res.json({ message: "Profile updated", user: updated });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
