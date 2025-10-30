// ai: create file path:src/modules/missions/service.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listActiveMissions = async () => {
  return prisma.mission.findMany({ where: { active: true } });
};

export const getUserMissions = async (userId: string) => {
  return prisma.userMission.findMany({ where: { userId }, include: { mission: true } });
};

export const incrementUserMission = async (userId: string, missionId: string, amount = 1) => {
  let um = await prisma.userMission.findFirst({ where: { userId, missionId } });
  if (!um) {
    um = await prisma.userMission.create({ data: { userId, missionId, progress: amount } });
  } else {
    um = await prisma.userMission.update({ where: { id: um.id }, data: { progress: { increment: amount } } });
  }
  // check completion
  const mission = await prisma.mission.findUnique({ where: { id: missionId } });
  if (mission && mission.target && um.progress >= mission.target && !um.completed) {
    await prisma.userMission.update({ where: { id: um.id }, data: { completed: true } });
    // Points are now credited via claimMission to support manual claiming.
  }
};

// FIX: Add missing claimMission function to resolve controller error.
export const claimMission = async (userId: string, missionId: string) => {
  const userMission = await prisma.userMission.findFirst({
    where: { userId, missionId },
    include: { mission: true },
  });

  if (!userMission) {
    throw new Error("Mission not started by user.");
  }

  if (!userMission.completed) {
    throw new Error("Mission is not yet completed.");
  }

  // Assumes a `rewardClaimed` field on the UserMission model to prevent double-claiming.
  if ((userMission as any).rewardClaimed) {
    throw new Error("Reward has already been claimed.");
  }

  const { mission } = userMission;
  let pointsAwarded = 0;
  if (mission && mission.rewardPoints) {
    pointsAwarded = mission.rewardPoints;
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { points: { increment: pointsAwarded } },
      }),
      prisma.loyaltyRecord.create({
        data: { userId, points: pointsAwarded, source: "MISSION" },
      }),
      prisma.userMission.update({
        where: { id: userMission.id },
        data: { rewardClaimed: true }, // Assumes `rewardClaimed` field exists
      }),
    ]);
  } else {
    // Still mark as claimed even if there are no points, to prevent re-claiming.
    await prisma.userMission.update({
      where: { id: userMission.id },
      data: { rewardClaimed: true }, // Assumes `rewardClaimed` field exists
    });
  }

  return { success: true, pointsAwarded };
};
