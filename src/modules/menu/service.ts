import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllMenuItems = async (storeId?: string, category?: string) => {
  return prisma.menuItem.findMany({
    where: { 
      available: true, 
      ...(storeId && { storeId }),
      ...(category && { category })
    },
    orderBy: { popularity: "desc" },
  });
};

export const getMenuItemById = async (id: string) => {
  return prisma.menuItem.findUnique({ where: { id } });
};

export const createMenuItem = async (data: any) => {
  return prisma.menuItem.create({ data });
};

export const updateMenuItem = async (id: string, data: any) => {
  return prisma.menuItem.update({ where: { id }, data });
};

export const deleteMenuItem = async (id: string) => {
  return prisma.menuItem.delete({ where: { id } });
};

export const getStores = async () => {
  return prisma.store.findMany({ include: { menuItems: true } });
};
