import { PrismaClient } from "@prisma/client";
import QRCode from "qrcode";
const prisma = new PrismaClient();

// Cart Services
export const getCart = (userId: string) => {
  return prisma.cartItem.findMany({
    where: { userId },
    include: { menuItem: true },
    orderBy: { createdAt: "asc" },
  });
};

export const addToCart = (userId: string, menuItemId: string, quantity: number, options: any) => {
  return prisma.cartItem.create({
    data: {
      userId,
      menuItemId,
      quantity,
      options,
    },
  });
};

export const updateCartItem = (cartItemId: string, quantity: number) => {
  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
};

export const removeFromCart = (cartItemId: string) => {
  return prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

// Order Services
export const createOrderFromCart = async (userId: string, storeId: string, fulfillment: string) => {
  const cartItems = await getCart(userId);
  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const total = cartItems.reduce((sum, item) => {
    return sum + item.menuItem.price * item.quantity;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        storeId,
        total,
        fulfillment,
        items: {
          create: cartItems.map((item) => ({
            menuItemId: item.menuItemId,
            name: item.menuItem.name,
            quantity: item.quantity,
            price: item.menuItem.price,
            options: item.options,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // generate QR code for pickup
    const qr = await QRCode.toDataURL(createdOrder.id);
    const orderWithQr = await tx.order.update({
        where: { id: createdOrder.id },
        data: { qrCode: qr },
        include: { items: true, store: true }
    });

    await tx.cartItem.deleteMany({
      where: { userId },
    });

    return orderWithQr;
  });

  return order;
};

export const getUserOrders = (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, store: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getOrderById = (orderId: string, userId: string) => {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true, store: true },
  });
};

export const updateOrderStatus = (orderId: string, status: string) => {
    return prisma.order.update({
        where: { id: orderId },
        data: { status }
    })
}