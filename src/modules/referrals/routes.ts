import express from "express";
import { authGuard } from "../../middleware/authGuard";
import { generateReferralHandler, useReferralHandler } from "./controller";
const router = express.Router();

router.post("/generate", authGuard, generateReferralHandler);

router.post("/use", authGuard, useReferralHandler);

export default router;
