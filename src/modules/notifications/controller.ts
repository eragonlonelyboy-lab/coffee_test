import { Request, Response } from "express";
import * as service from "./service";

export const sendEmailHandler = async (req: Request, res: Response) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
      return res.status(400).json({ message: "to, subject, and body are required." });
    }
    await service.sendEmail(to, subject, body);
    return res.json({ success: true, message: "Email sent." });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to send email." });
  }
};

export const sendPushHandler = async (req: Request, res: Response) => {
  try {
    const { userId, title, body } = req.body;
    if (!userId || !title || !body) {
      return res.status(400).json({ message: "userId, title, and body are required." });
    }
    await service.sendPush(userId, title, body);
    return res.json({ success: true, message: "Push notification sent." });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to send push notification." });
  }
};

export const getUserNotificationsHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const notifications = await service.getUserNotifications(userId);
        return res.json({ notifications });
    } catch (err: any) {
        return res.status(500).json({ message: "Failed to fetch notifications." });
    }
};
