import express from "express";
import { authGuard } from "../../middleware/authGuard";
import {
  createOrder,
  getOrder,
  updateStatus,
  getUserOrders,
} from "./controller";

const router = express.Router();

// Order Routes
router.get("/", authGuard, getUserOrders);
router.post("/", authGuard, createOrder);
router.get("/:id", authGuard, getOrder);
router.patch("/:id/status", authGuard, updateStatus);

export default router;
