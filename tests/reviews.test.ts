import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { getAuthToken } from "./test-utils";
import { PrismaClient, OrderStatus, DeliveryType } from "@prisma/client";

const prisma = new PrismaClient();

describe("Reviews Module", () => {
  it("should allow public access to GET /api/reviews/store/:storeId", async () => {
    const res = await request(app).get("/api/reviews/store/some-store-id");
    expect(res.statusCode).toBe(200);
    expect(res.body.reviews).toBeInstanceOf(Array);
  });

  it("should return 401 for POST /api/reviews without a token", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .send({ orderId: "some-order", storeId: "some-store", rating: 5 });
    expect(res.statusCode).toBe(401);
  });

  it("should return 401 for GET /api/reviews/me without a token", async () => {
    const res = await request(app).get("/api/reviews/me");
    expect(res.statusCode).toBe(401);
  });
});

describe("Review Submission and Deletion Logic", () => {
  let ownerAuth: { token: string; userId: string };
  let otherUserAuth: { token: string; userId: string };
  let storeId: string;
  let completedOrder: any;
  let inProgressOrder: any;

  beforeAll(async () => {
    ownerAuth = await getAuthToken();
    otherUserAuth = await getAuthToken(); 

    const store = await prisma.store.findFirst();
    if (!store) throw new Error("Test setup failed: No store found.");
    storeId = store.id;

    completedOrder = await prisma.order.create({
      data: {
        orderNumber: 'REVIEW-TEST-01',
        userId: ownerAuth.userId,
        storeId,
        totalAmount: 10,
        status: OrderStatus.COMPLETED,
        deliveryType: DeliveryType.PICKUP,
      },
    });
    inProgressOrder = await prisma.order.create({
      data: {
        orderNumber: 'REVIEW-TEST-02',
        userId: ownerAuth.userId,
        storeId,
        totalAmount: 10,
        status: OrderStatus.PREPARING,
        deliveryType: DeliveryType.PICKUP,
      },
    });
  });

  it("should submit a review for a completed order", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${ownerAuth.token}`)
      .send({
        orderId: completedOrder.id,
        storeId: storeId,
        rating: 5,
        comment: "Great coffee!",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.review).toBeDefined();
    expect(res.body.review.rating).toBe(5);
  });

  it("should fail to submit a review for the same order twice", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${ownerAuth.token}`)
      .send({
        orderId: completedOrder.id,
        storeId: storeId,
        rating: 4,
        comment: "Trying again",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("This order has already been reviewed.");
  });

  it("should fail to submit a review for an order that is not completed", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${ownerAuth.token}`)
      .send({
        orderId: inProgressOrder.id,
        storeId: storeId,
        rating: 5,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Order not eligible for review at this time.");
  });
  
  it("should fail when a user tries to review someone else's order", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${otherUserAuth.token}`) // Use the other user's token
      .send({
        orderId: completedOrder.id,
        storeId: storeId,
        rating: 1,
        comment: "Malicious review",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("You can only review your own orders.");
  });

  it("should fail to submit a review for a non-existent order", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${ownerAuth.token}`)
      .send({
        orderId: "non-existent-order-id",
        storeId: storeId,
        rating: 5,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Order not found");
  });

  it("should allow a user to delete their own review", async () => {
    // Create a new order and review for this test
    const order = await prisma.order.create({
      data: {
        orderNumber: 'REVIEW-DELETE-TEST-01',
        userId: ownerAuth.userId,
        storeId,
        totalAmount: 15,
        status: OrderStatus.COMPLETED,
        deliveryType: DeliveryType.PICKUP,
      },
    });
    const reviewRes = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${ownerAuth.token}`)
      .send({ orderId: order.id, storeId, rating: 4, comment: "To be deleted" });
    expect(reviewRes.statusCode).toBe(201);
    const reviewId = reviewRes.body.review.id;

    // Now delete it
    const deleteRes = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${ownerAuth.token}`);
    expect(deleteRes.statusCode).toBe(200);

    // Verify it's soft-deleted
    const softDeletedReview = await prisma.review.findUnique({ where: { id: reviewId } });
    expect(softDeletedReview?.deletedAt).not.toBeNull();
  });

  it("should prevent a user from deleting someone else's review", async () => {
    // 'ownerAuth' user creates a review
    const reviewRes = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${ownerAuth.token}`)
      .send({ orderId: completedOrder.id, storeId, rating: 5 }); // Use an order that can only be reviewed once
    
    // We expect this to fail since it was already reviewed, but if it succeeded, we'd get an ID
    // Let's create a new order just for this test to be clean
    const orderForDeletion = await prisma.order.create({
        data: {
            orderNumber: 'REVIEW-DELETE-FAIL-TEST-01',
            userId: ownerAuth.userId, storeId, totalAmount: 1, status: OrderStatus.COMPLETED, deliveryType: DeliveryType.PICKUP
        }
    });
    const reviewToFailDelete = await request(app).post("/api/reviews").set("Authorization", `Bearer ${ownerAuth.token}`).send({orderId: orderForDeletion.id, storeId, rating: 5});
    const reviewId = reviewToFailDelete.body.review.id;

    // 'otherUserAuth' tries to delete it
    const deleteRes = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${otherUserAuth.token}`);
      
    expect(deleteRes.statusCode).toBe(403);
    expect(deleteRes.body.message).toContain("not authorized");
  });
});
