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

export const deleteReviewHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { reviewId } = req.params;
        await svc.deleteReview(reviewId, userId);
        return res.status(200).json({ message: "Review deleted successfully." });
    } catch (err: any) {
        // Use 403 for authorization errors, 404 for not found, etc.
        if (err.message.includes("authorized")) {
            return res.status(403).json({ message: err.message });
        }
        if (err.message.includes("not found")) {
            return res.status(404).json({ message: err.message });
        }
        return res.status(400).json({ message: err.message });
    }
};

export const getLeaderboardHandler = async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
        const leaderboard = await svc.getTopRatedStores(limit);
        return res.json({ leaderboard });
    } catch (err) {
        return res.status(500).json({ message: "Failed to generate leaderboard." });
    }
};
