import cron from "node-cron";
import { PrismaClient, Tier } from "@prisma/client";
const prisma = new PrismaClient();

export const startCron = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily cron tasks...");
    
    // --- Expire Vouchers ---
    const expiredVouchers = await prisma.voucher.updateMany({ 
      where: { expiresAt: { lt: new Date() }, isActive: true }, 
      data: { isActive: false } 
    });
    if (expiredVouchers.count > 0) {
      console.log(`Expired ${expiredVouchers.count} vouchers.`);
    }

    // --- Tier Downgrades ---
    console.log("Checking for tier downgrades...");
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const usersToPotentiallyDowngrade = await prisma.user.findMany({
      where: {
        tier: { not: "BRONZE" },
        tierLastUpdatedAt: { lt: oneYearAgo },
      },
    });

    if (usersToPotentiallyDowngrade.length === 0) {
      console.log("No users eligible for tier downgrade check.");
    } else {
      console.log(`Found ${usersToPotentiallyDowngrade.length} users for potential downgrade.`);
      for (const user of usersToPotentiallyDowngrade) {
        let newTier: Tier = user.tier;
        switch (user.tier) {
          case "ELITE":
            newTier = "PLATINUM";
            break;
          case "PLATINUM":
            newTier = "GOLD";
            break;
          case "GOLD":
            newTier = "SILVER";
            break;
          case "SILVER":
            newTier = "BRONZE";
            break;
        }

        if (newTier !== user.tier) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              tier: newTier,
              tierLastUpdatedAt: new Date(),
            },
          });
          console.log(`Downgraded user ${user.email} from ${user.tier} to ${newTier}.`);
        }
      }
    }
    
    console.log("Daily cron tasks complete.");
  });
};
