import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { getAuthToken } from "./test-utils";

describe("Loyalty Module (Protected)", () => {
  let token: string;

  beforeAll(async () => {
    const auth = await getAuthToken();
    token = auth.token;
  });

  it("should return 401 for GET /points without a token", async () => {
    const res = await request(app).get("/api/loyalty/points");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 for GET /points with a token", async () => {
    const res = await request(app)
      .get("/api/loyalty/points")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("points");
  });

  it("should return 401 for GET /history without a token", async () => {
    const res = await request(app).get("/api/loyalty/history");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 for GET /history with a token", async () => {
    const res = await request(app)
      .get("/api/loyalty/history")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.history).toBeInstanceOf(Array);
  });

  it("should return 401 for POST /redeem without a token", async () => {
    const res = await request(app)
      .post("/api/loyalty/redeem")
      .send({ code: "test" });
    expect(res.statusCode).toBe(401);
  });
});
