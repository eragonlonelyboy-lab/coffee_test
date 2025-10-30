import { Request, Response } from "express";
import * as menuService from "./service";

export const getMenu = async (req: Request, res: Response) => {
  try {
    const { storeId, category } = req.query;
    const items = await menuService.getAllMenuItems(storeId as string, category as string);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Failed to load menu" });
  }
};

export const getMenuItem = async (req: Request, res: Response) => {
  try {
    const item = await menuService.getMenuItemById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ item });
  } catch {
    res.status(500).json({ message: "Error retrieving item" });
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const created = await menuService.createMenuItem(req.body);
    res.status(201).json({ message: "Menu item created", item: created });
  } catch {
    res.status(500).json({ message: "Creation failed" });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const updated = await menuService.updateMenuItem(req.params.id, req.body);
    res.json({ message: "Updated", item: updated });
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    await menuService.deleteMenuItem(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Deletion failed" });
  }
};

export const listStores = async (_: Request, res: Response) => {
  try {
    const stores = await menuService.getStores();
    res.json({ stores });
  } catch {
    res.status(500).json({ message: "Failed to load stores" });
  }
};
