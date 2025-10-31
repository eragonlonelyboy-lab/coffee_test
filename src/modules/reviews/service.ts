import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface ReviewInput {
    userId: string;
    orderId: string;
    storeId: string;
    rating: number;
    comment?: string;
}

export const submitReview = async (data: ReviewInput) => {
    const { userId, orderId, storeId, rating, comment } = data;

    // 1. Verify the order exists
    const order = await prisma.order.findUnique({
        where: { id: orderId }
    });
    if (!order) throw new Error("Order not found");

    // 1b. Verify it belongs to the user
    if (order.userId !== userId) {
        throw new Error("You can only review your own orders.");
    }
    
    // 2. Verify the order is in a reviewable state
    if (order.status !== 'COMPLETED') {
        throw new Error("Order not eligible for review at this time.");
    }
    
    // 3. Check if a review for this order already exists
    const existingReview = await prisma.review.findFirst({
        where: { orderId, deletedAt: null }
    });
    if (existingReview) {
        throw new Error("This order has already been reviewed.");
    }

    return prisma.review.create({
        data: {
            userId,
            orderId,
            storeId,
            rating,
            comment,
        }
    });
};

export const getReviewsByStore = async (storeId: string) => {
    return prisma.review.findMany({
        where: { storeId, deletedAt: null },
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true } },
            store: { select: { name: true } }
        }
    });
};

export const getReviewsByUser = async (userId: string) => {
    return prisma.review.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: {
            store: { select: { name: true } }
        }
    });
};


export const deleteReview = async (reviewId: string, userId: string) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId }
    });

    if (!review) {
        throw new Error("Review not found.");
    }
    if (review.userId !== userId) {
        throw new Error("You are not authorized to delete this review.");
    }

    // Soft delete
    return prisma.review.update({
        where: { id: reviewId },
        data: { deletedAt: new Date() }
    });
};

// For TopOutletsLeaderboard
export const getTopRatedStores = async (limit: number = 5) => {
    const aggregations = await prisma.review.groupBy({
        by: ['storeId'],
        _avg: {
            rating: true,
        },
        _count: {
            _all: true,
        },
        where: { deletedAt: null },
        orderBy: {
            _avg: {
                rating: 'desc'
            }
        },
        take: limit,
    });
    
    const storeIds = aggregations.map(agg => agg.storeId);
    if (storeIds.length === 0) return [];
    
    const stores = await prisma.store.findMany({
        where: { id: { in: storeIds } }
    });

    const leaderboard = aggregations.map(agg => {
        const store = stores.find(s => s.id === agg.storeId);
        return {
            storeId: agg.storeId,
            storeName: store?.name || 'Unknown Store',
            averageRating: agg._avg.rating || 0,
            reviewCount: agg._count._all,
        };
    });

    return leaderboard;
};
