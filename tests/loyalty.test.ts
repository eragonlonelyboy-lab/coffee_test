import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app";

describe("Loyalty Module (Protected)", () => {
  it("should return 401 for GET /points without a token", async () => {
    const res = await request(app).get("/api/loyalty/points");
    expect(res.statusCode).toBe(401);
  });

  it("should return 401 for POST /redeem without a token", async () => {
    const res = await request(app)
      .post("/api/loyalty/redeem")
      .send({ code: "test" });
    expect(res.statusCode).toBe(401);
  });
});
