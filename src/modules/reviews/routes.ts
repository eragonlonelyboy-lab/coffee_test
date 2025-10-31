import express from "express";
import { authGuard } from "../../middleware/authGuard";
import { submitReviewHandler, getStoreReviewsHandler, getUserReviewsHandler, deleteReviewHandler, getLeaderboardHandler } from "./controller";

const router = express.Router();
router.post("/", authGuard, submitReviewHandler);
router.get("/store/:storeId", getStoreReviewsHandler);
router.get("/leaderboard/stores", getLeaderboardHandler);
router.get("/me", authGuard, getUserReviewsHandler);
router.delete("/:reviewId", authGuard, deleteReviewHandler);
export default router;
