import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Mock payment initializer (replace with Stripe integration)
export const initiatePayment = async (orderId: string, amount: number) => {
  // create payment record with PENDING
  const payment = await prisma.payment.create({
    data: {
      orderId,
      amount,
      status: "PENDING",
    },
  });
  // In real integration, create a paymentIntent and return client_secret
  return { payment, clientSecret: "mock_client_secret" };
};

export const confirmPayment = async (paymentId: string, providerRef?: string) => {
  const p = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "CONFIRMED", providerRef },
  });
  // mark order as CONFIRMED or PAID
  await prisma.order.update({ where: { id: p.orderId }, data: { status: "CONFIRMED" } });
  return p;
};

export const refundPayment = async (paymentId: string) => {
  const p = await prisma.payment.update({ where: { id: paymentId }, data: { status: "REFUNDED" } });
  await prisma.order.update({ where: { id: p.orderId }, data: { status: "REFUNDED" } });
  return p;
};
