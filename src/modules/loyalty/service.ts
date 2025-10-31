import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const creditPoints = async (userId: string, points: number, description = "Order credit") => {
  // create loyalty record and increment user points
  await prisma.$transaction([
    prisma.loyaltyRecord.create({ data: { userId, pointsEarned: points, description } }),
    prisma.user.update({ where: { id: userId }, data: { points: { increment: points } } })
  ]);
};

export const getPoints = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { points: true } });
  return user?.points ?? 0;
};

export const getLoyaltyHistory = async (userId: string) => {
    return prisma.loyaltyRecord.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
};

export const redeemVoucher = async (userId: string, voucherCode: string) => {
  // This function seems to reference a `Voucher` model that doesn't exist in the new schema.
  // This would need to be re-implemented based on the `Promotion` model.
  // For now, we'll throw an error indicating it's not implemented.
  throw new Error("Voucher redemption logic needs to be updated for the new schema.");
};
