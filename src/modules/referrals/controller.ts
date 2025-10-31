import { Request, Response } from "express";
import * as referralService from "./service";

export const generateReferralHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const referral = await referralService.generateReferral(userId);
        res.json({ referral });
    } catch (err) {
        res.status(500).json({ message: "Failed to generate referral code." });
    }
};

export const useReferralHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId; // The new user using the code
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: "Referral code is required." });
        }
        const result = await referralService.useReferral(code, userId);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};