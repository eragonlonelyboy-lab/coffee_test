import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const sendEmail = async (to: string, subject: string, body: string) => {
  // stub: integrate SendGrid or nodemailer
  console.log("EMAIL SEND:", to, subject);
  await prisma.notification.create({ data: { userId: null, type: "EMAIL", channel: "EMAIL", payload: body, status: "SENT" } });
  return true;
};

export const sendPush = async (userId: string, title: string, body: string) => {
  // stub: integrate FCM or OneSignal
  console.log("PUSH:", userId, title);
  await prisma.notification.create({ data: { userId, type: "ORDER", channel: "PUSH", payload: JSON.stringify({ title, body }), status: "SENT" } });
  return true;
};

export const getUserNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};
