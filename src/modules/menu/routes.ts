import express from "express";
import { listMenuItems, listStores, getStore } from "./controller";

const router = express.Router();

router.get("/", listMenuItems);
router.get("/stores/all", listStores);
router.get("/stores/:storeId", getStore);

export default router;
