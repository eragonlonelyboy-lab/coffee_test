import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listActivePromotions = async () => prisma.promotion.findMany({ where: { isActive: true, deletedAt: null } });
