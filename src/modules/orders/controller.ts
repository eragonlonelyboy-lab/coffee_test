import { Request, Response } from "express";
import { DeliveryType, OrderStatus } from "@prisma/client";
import * as orderService from "./service";

// --- Order Handlers ---

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { storeId, deliveryType = "PICKUP", items } = req.body;

    if (!storeId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "storeId and a non-empty items array are required" });
    }

    const order = await orderService.createOrder(userId, storeId, deliveryType as DeliveryType, items);
    
    // TODO: Trigger payment initiation
    // TODO: Notify store via notifications module
    
    return res.status(201).json({ order });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Create order failed" });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const orders = await orderService.getUserOrders(userId);
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching user orders" });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const order = await orderService.getOrderById(req.params.id, userId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching order" });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status || !Object.values(OrderStatus).includes(status as OrderStatus)) {
      return res.status(400).json({ message: "A valid status is required" });
    }
    const updated = await orderService.updateOrderStatus(req.params.id, status as OrderStatus);
    // TODO: push notification to user/store
    return res.json({ message: "Status updated", order: updated });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
