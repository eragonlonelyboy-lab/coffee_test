import express from "express";
import { authGuard } from "../../middleware/authGuard";
// FIX: Corrected handler names to match controller exports and added the missing claim route.
import {
  listActiveMissions,
  getMissions,
  claimMissionReward,
} from "./controller";

const router = express.Router();
router.get("/", listActiveMissions);
router.get("/me", authGuard, getMissions);
router.post("/:missionId/claim", authGuard, claimMissionReward);
export default router;
