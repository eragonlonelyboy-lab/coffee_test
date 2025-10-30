import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const creditPoints = async (userId: string, points: number, source = "ORDER") => {
  // create loyalty record and increment user points
  await prisma.loyaltyRecord.create({ data: { userId, points, source } });
  await prisma.user.update({ where: { id: userId }, data: { points: { increment: points } } });
};

export const getPoints = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { points: true } });
  return user?.points ?? 0;
};

export const redeemVoucher = async (userId: string, voucherCode: string) => {
  const v = await prisma.voucher.findUnique({ where: { code: voucherCode } });
  if (!v || !v.isActive) throw new Error("Invalid voucher");
  // simple points cost logic
  if (v.pointsCost) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if ((user?.points || 0) < v.pointsCost) throw new Error("Insufficient points");
    await prisma.user.update({ where: { id: userId }, data: { points: { decrement: v.pointsCost } } });
    return { success: true, voucher: v };
  }
  return { success: true, voucher: v };
};
