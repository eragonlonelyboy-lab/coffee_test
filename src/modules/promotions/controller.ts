import { Request, Response } from "express";
import * as promotionService from "./service";

export const listActivePromotionsHandler = async (req: Request, res: Response) => {
  try {
    const promotions = await promotionService.listActivePromotions();
    res.json({ promotions });
  } catch (err) {
    res.status(500).json({ message: "Failed to load promotions" });
  }
};
