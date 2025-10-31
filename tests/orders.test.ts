import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { getAuthToken } from "./test-utils";
import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

describe("Orders Module (Protected Routes)", () => {
  let token: string;
  let storeId: string;
  let menuItemId: string;

  beforeAll(async () => {
    const auth = await getAuthToken();
    token = auth.token;
    const store = await prisma.store.findFirst();
    if (!store) throw new Error("No stores seeded for testing");
    storeId = store.id;

    const menuItem = await prisma.menuItem.findFirst();
    if (!menuItem) throw new Error("No menu items seeded for testing");
    menuItemId = menuItem.id;
  });

  it("should return 401 for POST / without a token", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ storeId, items: [{ menuItemId, quantity: 1 }] });
    expect(res.statusCode).toBe(401);
  });

  it("should fail to create an order with an empty items array", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ storeId, items: [] });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("non-empty items array");
  });

  it("should create an order with valid items", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ storeId, items: [{ menuItemId, quantity: 1 }] });

    expect(res.statusCode).toBe(201);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.status).toBe(OrderStatus.NEW);
  });
});

describe("Order State Transitions", () => {
  let token: string;
  let createdOrderId: string;

  beforeAll(async () => {
    const auth = await getAuthToken();
    token = auth.token;
    
    const store = await prisma.store.findFirst();
    const menuItem = await prisma.menuItem.findFirst();

    const orderRes = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({ storeId: store!.id, items: [{ menuItemId: menuItem!.id, quantity: 1 }] });
    createdOrderId = orderRes.body.order.id;
  });

  it("should allow updating order status sequentially", async () => {
    // PREPARING
    let res = await request(app)
      .patch(`/api/orders/${createdOrderId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: OrderStatus.PREPARING });
    expect(res.statusCode).toBe(200);
    expect(res.body.order.status).toBe(OrderStatus.PREPARING);

    // READY
    res = await request(app)
      .patch(`/api/orders/${createdOrderId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: OrderStatus.READY });
    expect(res.statusCode).toBe(200);
    expect(res.body.order.status).toBe(OrderStatus.READY);
    
    // COMPLETED
    res = await request(app)
      .patch(`/api/orders/${createdOrderId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: OrderStatus.COMPLETED });
    expect(res.statusCode).toBe(200);
    expect(res.body.order.status).toBe(OrderStatus.COMPLETED);
  });
});