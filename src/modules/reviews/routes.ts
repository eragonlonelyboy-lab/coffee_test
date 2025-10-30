import express from "express";
import { authGuard } from "../../middleware/authGuard";
import { submitReviewHandler, getStoreReviewsHandler, getUserReviewsHandler } from "./controller";

const router = express.Router();
router.post("/", authGuard, submitReviewHandler);
router.get("/store/:storeId", getStoreReviewsHandler);
router.get("/me", authGuard, getUserReviewsHandler);
export default router;