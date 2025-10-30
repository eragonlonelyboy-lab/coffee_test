import { Request, Response } from "express";
import * as svc from "./service";

export const submitReviewHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { orderId, storeId, rating, comment } = req.body;

    if (!orderId || !storeId || rating == null) {
      return res.status(400).json({ message: "orderId, storeId, and rating are required." });
    }

    const review = await svc.submitReview({ userId, orderId, storeId, rating, comment });
    return res.status(201).json({ review });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const getStoreReviewsHandler = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const reviews = await svc.getReviewsByStore(storeId);
    return res.json({ reviews });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch store reviews." });
  }
};

export const getUserReviewsHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const reviews = await svc.getReviewsByUser(userId);
        return res.json({ reviews });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch user reviews." });
    }
};