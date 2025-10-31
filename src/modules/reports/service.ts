import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const salesReport = async (fromDate: string, toDate: string) => {
  const from = new Date(fromDate); const to = new Date(toDate);
  const rows = await prisma.order.groupBy({
    by: ["storeId"],
    where: { createdAt: { gte: from, lte: to } },
    _sum: { totalAmount: true },
    _count: { id: true },
  });
  return rows;
};

export const popularItems = async (limit = 10) => {
  const rows = await prisma.orderItem.groupBy({
    by: ["menuItemId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });
  return rows;
};
