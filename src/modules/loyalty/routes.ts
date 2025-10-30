import express from "express";
import { authGuard } from "../../middleware/authGuard";
import { getPointsHandler, redeemHandler } from "./controller";

const router = express.Router();

router.get("/points", authGuard, getPointsHandler);
router.post("/redeem", authGuard, redeemHandler);

export default router;
