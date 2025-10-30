import { Request, Response } from "express";
import * as paymentService from "./service";

export const initiatePaymentHandler = async (req: Request, res: Response) => {
  try {
    const { orderId, amount } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ message: "orderId and amount are required" });
    }
    const payload = await paymentService.initiatePayment(orderId, amount);
    return res.json(payload);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const confirmPaymentHandler = async (req: Request, res: Response) => {
  try {
    const { paymentId, providerRef } = req.body;
    if (!paymentId) {
       return res.status(400).json({ message: "paymentId is required" });
    }
    const confirmed = await paymentService.confirmPayment(paymentId, providerRef);
    // TODO: credit loyalty points via loyalty module
    return res.json({ confirmed });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const refundPaymentHandler = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) {
       return res.status(400).json({ message: "paymentId is required" });
    }
    const r = await paymentService.refundPayment(paymentId);
    return res.json({ refunded: r });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
