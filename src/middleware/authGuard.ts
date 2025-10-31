import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("FATAL_ERROR: JWT_SECRET environment variable is not set. Please provide it in your .env file.");
}

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing auth token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};