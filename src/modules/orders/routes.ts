import express from "express";
import { authGuard } from "../../middleware/authGuard";
// FIX: Corrected handler names to match controller exports and added missing handlers.
import {
  createOrder,
  getOrder,
  updateStatus,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getUserOrders,
} from "./controller";

const router = express.Router();

// Cart Routes
router.get("/cart", authGuard, getCart);
router.post("/cart", authGuard, addToCart);
router.put("/cart/:itemId", authGuard, updateCartItem);
router.delete("/cart/:itemId", authGuard, removeFromCart);

// Order Routes
router.get("/", authGuard, getUserOrders);
router.post("/", authGuard, createOrder);
router.get("/:id", authGuard, getOrder);
router.patch("/:id/status", authGuard, updateStatus);

export default router;
