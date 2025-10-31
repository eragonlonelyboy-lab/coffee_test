import { PrismaClient } from "@prisma/client";
import { customAlphabet } from "nanoid";
const prisma = new PrismaClient();

// Use nanoid for robust, URL-safe code generation.
const generateCode = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

export const generateReferral = async (referrerId: string) => {
  const code = generateCode();
  return prisma.referral.create({ data: { code, referrerId } });
};

export const useReferral = async (code: string, newUserId: string) => {
  const r = await prisma.referral.findUnique({ where: { code } });
  if (!r) throw new Error("Invalid referral");
  if (r.usedBy) throw new Error("Referral already used");
  if (r.referrerId === newUserId) throw new Error("You cannot use your own referral code");

  await prisma.referral.update({ where: { id: r.id }, data: { usedBy: newUserId } });
  
  // credit referrer bonus via loyalty
  await prisma.loyaltyRecord.create({ data: { userId: r.referrerId, points: 200, source: "REFERRAL" } });
  await prisma.user.update({ where: { id: r.referrerId }, data: { points: { increment: 200 } } });
  
  return { success: true };
};