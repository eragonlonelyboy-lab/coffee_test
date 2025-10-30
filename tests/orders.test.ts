import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app";

describe("Orders Module (Protected Routes)", () => {
  it("should return 401 for GET /cart without a token", async () => {
    const res = await request(app).get("/api/orders/cart");
    expect(res.statusCode).toBe(401);
  });
  
  it("should return 401 for POST / without a token", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ storeId: "123" });
    expect(res.statusCode).toBe(401);
  });
});
