import express from "express";
import { registerUser, loginUser, getProfile, updateProfile } from "./controller";
import { authGuard } from "../../middleware/authGuard";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authGuard, getProfile);
router.put("/profile", authGuard, updateProfile);

export default router;
