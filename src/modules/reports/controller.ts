import { Request, Response } from "express";
import * as service from "./service";

export const getSalesReport = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.query;
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "fromDate and toDate query parameters are required." });
    }
    const report = await service.salesReport(fromDate as string, toDate as string);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate sales report." });
  }
};

export const getPopularItems = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const items = await service.popularItems(limit);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate popular items report." });
  }
};
