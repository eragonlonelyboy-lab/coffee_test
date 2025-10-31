import { PrismaClient, DeliveryType, OrderStatus } from "@prisma/client";
import QRCode from "qrcode";
const prisma = new PrismaClient();

interface OrderItemInput {
    menuItemId: string;
    quantity: number;
    // Add other customizations if needed
}

// Order Services
export const createOrder = async (userId: string, storeId: string, deliveryType: DeliveryType, items: OrderItemInput[]) => {
  if (items.length === 0) {
    throw new Error("Cannot create an order with no items");
  }

  const menuItemIds = items.map(item => item.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } }
  });

  const totalAmount = items.reduce((sum, item) => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      if (!menuItem) throw new Error(`Menu item with id ${item.menuItemId} not found`);
      return sum + menuItem.basePrice * item.quantity;
  }, 0);

  const orderCounter = await prisma.order.count() + 1001;

  const order = await prisma.order.create({
      data: {
          orderNumber: `LB${orderCounter}`,
          userId,
          storeId,
          totalAmount,
          deliveryType,
          status: OrderStatus.NEW, // Orders start as NEW
          items: {
              create: items.map(item => {
                  const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
                  if (!menuItem) {
                      // This should not happen due to the check above, but as a safeguard:
                      throw new Error(`Menu item with id ${item.menuItemId} disappeared during transaction.`);
                  }
                  return {
                      menuItemId: item.menuItemId,
                      quantity: item.quantity,
                      linePrice: menuItem.basePrice * item.quantity,
                      // Add customizations here if needed
                  };
              }),
          },
      },
      include: {
          items: {
              include: {
                  menuItem: {
                      select: { name: true }
                  }
              }
          },
          store: true,
      },
  });

  return order;
};

export const getUserOrders = (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: { 
        items: {
            include: {
                menuItem: {
                    select: { name: true }
                }
            }
        }, 
        store: true 
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getOrderById = (orderId: string, userId: string) => {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
     include: { 
        items: {
            include: {
                menuItem: {
                    select: { name: true }
                }
            }
        }, 
        store: true 
    },
  });
};

export const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    return prisma.order.update({
        where: { id: orderId },
        data: { status }
    })
}