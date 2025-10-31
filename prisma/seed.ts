/**
 * EliteBrew Backend – Prisma Seed Script (v1.0)
 * Seeds realistic mock data for all 12 backend stages.
 * Run:  npx ts-node prisma/seed.ts
 */

import { PrismaClient, Tier, OrderStatus, PaymentStatus, DeliveryType, MissionType, NotificationType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcryptjs from "bcryptjs";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import process from "process";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting EliteBrew seed...");

  // -------------------------------
  // 1️⃣ USERS
  // -------------------------------
  const passwordHash = await bcryptjs.hash("password123", 10);

  const users = await Promise.all(
    Array.from({ length: 10 }).map(async () =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          passwordHash,
          name: faker.person.fullName(),
          dateOfBirth: faker.date.birthdate(),
          phone: faker.phone.number(),
          tier: faker.helpers.arrayElement([Tier.BRONZE, Tier.SILVER, Tier.GOLD]),
          points: faker.number.int({ min: 0, max: 2000 }),
          favoriteDrinks: faker.helpers.arrayElements(["Latte", "Americano", "Cappuccino", "Mocha"], 2),
        },
      })
    )
  );
  
  // Upsert a consistent user for frontend testing
  await prisma.user.upsert({
      where: { email: 'test@coffee.com'},
      update: {
          passwordHash
      },
      create: {
          email: 'test@coffee.com',
          passwordHash,
          name: 'Demo User',
          tier: Tier.GOLD,
          points: 2500
      }
  })
  const demoUser = await prisma.user.findUnique({ where: { email: 'test@coffee.com' }});
  if (demoUser) users.push(demoUser);


  console.log(`Created/updated ${users.length} users.`);

  // -------------------------------
  // 2️⃣ STORES
  // -------------------------------
  const stores = await Promise.all(
    Array.from({ length: 5 }).map(async () =>
      prisma.store.create({
        data: {
          name: `${faker.location.city()} EliteBrew`,
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          latitude: Number(faker.location.latitude()),
          longitude: Number(faker.location.longitude()),
          openingHours: "08:00 - 22:00",
          isActive: true,
        },
      })
    )
  );
   console.log(`Created ${stores.length} stores.`);

  // -------------------------------
  // 3️⃣ MENU ITEMS
  // -------------------------------
  const categories = ["Coffee", "Non-Coffee", "Pastry", "Seasonal"];
  const menuItems = [];

  for (const store of stores) {
    for (let i = 0; i < 10; i++) {
      const item = await prisma.menuItem.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: faker.helpers.arrayElement(categories),
          basePrice: faker.number.float({ min: 5, max: 20, precision: 0.1 }),
          imageUrl: faker.image.urlLoremFlickr({ category: 'coffee' }),
          storeId: store.id,
        },
      });
      menuItems.push(item);
    }
  }
  console.log(`Created ${menuItems.length} menu items.`);

  // -------------------------------
  // 4️⃣ ORDERS + ITEMS + PAYMENTS
  // -------------------------------
  for (const user of users) {
    const store = faker.helpers.arrayElement(stores);
    const availableItems = menuItems.filter(i => i.storeId === store.id);
    if(availableItems.length === 0) continue;

    const selectedItems = faker.helpers.arrayElements(availableItems, 3);
    const total = selectedItems.reduce((acc, i) => acc + i.basePrice, 0);

    const order = await prisma.order.create({
      data: {
        orderNumber: `EB-${nanoid(6).toUpperCase()}`,
        userId: user.id,
        storeId: store.id,
        deliveryType: faker.helpers.arrayElement([DeliveryType.PICKUP, DeliveryType.DELIVERY]),
        totalAmount: total,
        pointsEarned: Math.round(total),
        status: faker.helpers.arrayElement([
          OrderStatus.PENDING,
          OrderStatus.CONFIRMED,
          OrderStatus.PREPARING,
          OrderStatus.READY,
          OrderStatus.COMPLETED,
        ]),
        pickupCode: `PICK-${nanoid(4).toUpperCase()}`,
        etaMinutes: faker.number.int({ min: 5, max: 15 }),
      },
    });

    for (const item of selectedItems) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          menuItemId: item.id,
          quantity: faker.number.int({ min: 1, max: 2 }),
          size: faker.helpers.arrayElement(["S", "M", "L"]),
          milkType: faker.helpers.arrayElement(["Regular", "Oat", "Soy"]),
          sugarLevel: faker.helpers.arrayElement(["0%", "50%", "100%"]),
          iceLevel: faker.helpers.arrayElement(["None", "Less", "Normal"]),
          addOns: faker.helpers.arrayElements(["Extra Shot", "Whipped Cream", "Caramel Syrup"], 1),
          linePrice: item.basePrice,
        },
      });
    }

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: total,
        provider: "Stripe",
        transactionId: nanoid(12),
        status: faker.helpers.arrayElement([PaymentStatus.SUCCESS, PaymentStatus.FAILED]),
        userId: user.id,
      },
    });
  }
  console.log(`Created orders, items, and payments.`);

  // -------------------------------
  // 5️⃣ LOYALTY RECORDS
  // -------------------------------
  for (const user of users) {
    await prisma.loyaltyRecord.create({
      data: {
        userId: user.id,
        pointsEarned: faker.number.int({ min: 50, max: 200 }),
        description: "Initial points from order",
        expiryDate: dayjs().add(12, "month").toDate(),
      },
    });
  }
  console.log(`Created loyalty records.`);

  // -------------------------------
  // 6️⃣ MISSIONS
  // -------------------------------
  const missions = await Promise.all([
    prisma.mission.create({
      data: {
        title: "Buy 3 Coffees This Week",
        description: "Complete 3 purchases in a week",
        type: MissionType.PURCHASE,
        rewardPoints: 100,
        startDate: dayjs().startOf("week").toDate(),
        endDate: dayjs().endOf("week").toDate(),
      },
    }),
    prisma.mission.create({
      data: {
        title: "Invite 2 Friends",
        description: "Refer 2 users to EliteBrew",
        type: MissionType.REFERRAL,
        rewardPoints: 150,
        startDate: dayjs().toDate(),
        endDate: dayjs().add(7, "day").toDate(),
      },
    }),
  ]);

  for (const mission of missions) {
    await prisma.missionCompletion.create({
      data: {
        userId: faker.helpers.arrayElement(users).id,
        missionId: mission.id,
      },
    });
  }
  console.log(`Created missions and completions.`);

  // -------------------------------
  // 7️⃣ REVIEWS
  // -------------------------------
  const completedOrders = await prisma.order.findMany({ where: { status: OrderStatus.COMPLETED } });
  for (const order of completedOrders.slice(0, 10)) {
    await prisma.review.create({
      data: {
        userId: order.userId,
        storeId: order.storeId,
        orderId: order.id,
        rating: faker.number.int({ min: 3, max: 5 }),
        comment: faker.lorem.sentence(),
      },
    });
  }
  console.log(`Created reviews.`);

  // -------------------------------
  // 8️⃣ PROMOTIONS
  // -------------------------------
  await Promise.all([
    prisma.promotion.create({
      data: {
        code: "ELITE10",
        title: "10% Off for Elites",
        description: "A special thank you for our most loyal customers.",
        discountType: "percentage",
        discountValue: 10,
        startDate: dayjs().subtract(1, "day").toDate(),
        endDate: dayjs().add(30, "day").toDate(),
      },
    }),
    prisma.promotion.create({
      data: {
        code: "BIRTHDAYCAKE",
        title: "Free Cake on Your Birthday",
        description: "Celebrate your special day with a treat on us!",
        discountType: "fixed",
        discountValue: 15,
        startDate: dayjs().toDate(),
        endDate: dayjs().add(60, "day").toDate(),
      },
    }),
  ]);
   console.log(`Created promotions.`);

  // -------------------------------
  // 9️⃣ WALLETS
  // -------------------------------
  for (const user of users) {
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: faker.number.float({ min: 0, max: 100 }),
        autoTopUp: faker.datatype.boolean(),
      },
    });
  }
  console.log(`Created wallets.`);

  // -------------------------------
  // 🔟 REFERRALS
  // -------------------------------
  for (let i = 0; i < 5; i++) {
    const referrer = faker.helpers.arrayElement(users);
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredEmail: faker.internet.email(),
        bonusGiven: faker.datatype.boolean(),
      },
    });
  }
  console.log(`Created referrals.`);

  // -------------------------------
  // 11️⃣ NOTIFICATIONS
  // -------------------------------
  for (const user of users) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: NotificationType.REWARD,
        title: "Welcome Bonus",
        message: "You’ve earned 100 points as a new EliteBrew member!",
      },
    });
  }
  console.log(`Created notifications.`);

  // -------------------------------
  // 12️⃣ REPORT LOGS
  // -------------------------------
  await prisma.reportLog.create({
    data: {
      type: "sales",
      periodStart: dayjs().subtract(7, "day").toDate(),
      periodEnd: dayjs().toDate(),
      data: {
        totalOrders: 120,
        topItems: ["Latte", "Cappuccino"],
        totalRevenue: 3200,
      },
    },
  });
   console.log(`Created report logs.`);


  console.log("✅ Seed completed successfully!");
}

main()
  .catch(e => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });