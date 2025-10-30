import { Request, Response } from "express";
import * as missionService from "./service";

export const listActiveMissions = async (req: Request, res: Response) => {
  try {
    const missions = await missionService.listActiveMissions();
    res.json({ missions });
  } catch (err) {
    res.status(500).json({ message: "Failed to load active missions" });
  }
};

export const getMissions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const missions = await missionService.getUserMissions(userId);
    res.json({ missions });
  } catch (err) {
    res.status(500).json({ message: "Failed to load missions" });
  }
};

export const claimMissionReward = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { missionId } = req.params;
        const result = await missionService.claimMission(userId, missionId);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};
