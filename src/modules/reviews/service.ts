import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const submitReview = async ({ userId, orderId, storeId, rating, comment }: any) => {
  // Ensure order exists, belongs to user, and is in a reviewable state
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("You can only review your own orders.");
  // Assuming 'COMPLETED' is a final status that allows reviews
  if (order.status !== "COMPLETED") throw new Error("Order not eligible for review at this time.");

  // Ensure not already reviewed by checking for a unique orderId in reviews
  const existing = await prisma.review.findUnique({ where: { orderId } });
  if (existing) throw new Error("This order has already been reviewed.");

  const review = await prisma.review.create({ 
    data: { userId, orderId, storeId, rating, comment } 
  });
  
  // In a real app, you might trigger a background job to update the store's average rating.
  
  return review;
};

export const getReviewsByStore = async (storeId: string) => {
  return prisma.review.findMany({ 
      where: { storeId, isActive: true }, 
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } } // Include user's name for display
    });
};

export const getReviewsByUser = async (userId: string) => {
  return prisma.review.findMany({
    where: { userId },
    include: { store: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
};