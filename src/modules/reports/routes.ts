import express from "express";
import { authGuard } from "../../middleware/authGuard";
import { getSalesReport, getPopularItems } from "./controller";
const router = express.Router();

router.get("/sales", authGuard, getSalesReport);

router.get("/popular-items", authGuard, getPopularItems);

export default router;
