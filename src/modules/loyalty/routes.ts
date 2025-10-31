import express from "express";
import { authGuard } from "../../middleware/authGuard";
import { getPointsHandler, redeemHandler, getHistoryHandler } from "./controller";

const router = express.Router();

router.get("/points", authGuard, getPointsHandler);
router.get("/history", authGuard, getHistoryHandler);
router.post("/redeem", authGuard, redeemHandler);

export default router;
