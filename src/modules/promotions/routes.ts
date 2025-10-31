import express from "express";
import { listActivePromotionsHandler } from "./controller";

const router = express.Router();

router.get("/", listActivePromotionsHandler);

export default router;
