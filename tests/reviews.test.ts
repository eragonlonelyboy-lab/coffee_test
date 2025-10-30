import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app";

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