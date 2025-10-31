import { Request, Response } from "express";
import * as service from "./service";

export const getPointsHandler = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const pts = await service.getPoints(userId);
  return res.json({ points: pts });
};

export const getHistoryHandler = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const history = await service.getLoyaltyHistory(userId);
    return res.json({ history });
};

export const redeemHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { code } = req.body;
    const result = await service.redeemVoucher(userId, code);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
