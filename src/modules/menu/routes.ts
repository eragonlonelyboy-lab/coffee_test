import express from "express";
import { authGuard } from "../../middleware/authGuard";
import {
  getMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  listStores,
} from "./controller";

const router = express.Router();

// Public
router.get("/", getMenu);
router.get("/stores/all", listStores);
router.get("/:id", getMenuItem);

// Admin (protected)
router.post("/", authGuard, createMenuItem);
router.put("/:id", authGuard, updateMenuItem);
router.delete("/:id", authGuard, deleteMenuItem);

export default router;
