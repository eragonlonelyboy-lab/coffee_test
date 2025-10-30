import express from "express";
import { authGuard } from "../../middleware/authGuard";
import { initiatePaymentHandler, confirmPaymentHandler, refundPaymentHandler } from "./controller";

const router = express.Router();

router.post("/initiate", authGuard, initiatePaymentHandler);
router.post("/confirm", authGuard, confirmPaymentHandler);
// admin
router.post("/refund", authGuard, refundPaymentHandler);

export default router;
