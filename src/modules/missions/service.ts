// ai: create file path:src/modules/missions/service.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listActiveMissions = async () => {
  return prisma.mission.findMany({ 
    where: { 
      endDate: { gte: new Date() } 
    } 
  });
};

export const getUserMissions = async (userId: string) => {
  return prisma.missionCompletion.findMany({ where: { userId }, include: { mission: true } });
};


export const completeMission = async (userId: string, missionId: string) => {
  const existingCompletion = await prisma.missionCompletion.findFirst({
    where: { userId, missionId },
  });

  if (existingCompletion) {
    throw new Error("Mission already completed.");
  }

  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  });

  if (!mission) {
    throw new Error("Mission not found.");
  }
  
  // Use a transaction to ensure atomicity
  const [, , completion] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { points: { increment: mission.rewardPoints } },
    }),
    prisma.loyaltyRecord.create({
      data: {
        userId: userId,
        pointsEarned: mission.rewardPoints,
        description: `Mission: ${mission.title}`,
      },
    }),
     prisma.missionCompletion.create({
      data: {
        userId: userId,
        missionId: missionId,
      },
    }),
  ]);

  return { success: true, pointsAwarded: mission.rewardPoints, completion };
};
