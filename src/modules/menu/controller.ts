import { Request, Response } from "express";
import * as menuService from "./service";

export const listMenuItems = async (req: Request, res: Response) => {
    try {
        const lang = req.query.lang as string || 'en';
        const items = await menuService.getMenuItems(lang);
        res.json({ items });
    } catch (err) {
        res.status(500).json({ message: "Failed to load menu items" });
    }
};

export const listStores = async (req: Request, res: Response) => {
    try {
        const stores = await menuService.getAllStores();
        res.json({ stores });
    } catch (err) {
        res.status(500).json({ message: "Failed to load stores" });
    }
};

export const getStore = async (req: Request, res: Response) => {
    try {
        const { storeId } = req.params;
        const store = await menuService.getStoreById(storeId);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }
        res.json({ store });
    } catch (err) {
        res.status(500).json({ message: "Failed to load store details" });
    }
};
