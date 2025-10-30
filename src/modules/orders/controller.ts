import { Request, Response } from "express";
import * as orderService from "./service";

// --- Cart Handlers ---

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const cartItems = await orderService.getCart(userId);
    return res.json(cartItems);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error getting cart" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { menuItemId, quantity, options } = req.body;
    if (!menuItemId || quantity == null) {
      return res.status(400).json({ message: "menuItemId and quantity are required" });
    }
    const cartItem = await orderService.addToCart(userId, menuItemId, quantity, options || {});
    return res.status(201).json(cartItem);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error adding to cart" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity == null) {
      return res.status(400).json({ message: "quantity is required" });
    }

    if (quantity <= 0) {
      await orderService.removeFromCart(itemId);
      return res.status(204).send();
    }
    const updatedItem = await orderService.updateCartItem(itemId, quantity);
    return res.json(updatedItem);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating cart item" });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    await orderService.removeFromCart(itemId);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error removing from cart" });
  }
};

// --- Order Handlers ---

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    // FIX: Service has `createOrderFromCart`, not `createOrder`. Call the correct function.
    const { storeId, fulfillment = "PICKUP" } = req.body;
    if (!storeId) {
      return res.status(400).json({ message: "storeId is required" });
    }
    const order = await orderService.createOrderFromCart(userId, storeId, fulfillment);
    // TODO: notify store via notifications module
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
    // FIX: Pass userId to `getOrderById` as required by its signature.
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
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const updated = await orderService.updateOrderStatus(req.params.id, status);
    // TODO: push notification to user/store
    return res.json({ message: "Status updated", order: updated });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
