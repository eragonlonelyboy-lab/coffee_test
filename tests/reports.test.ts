import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { getAuthToken } from "./test-utils";

describe("Reports Module (Protected)", () => {
  let token: string;

  beforeAll(async () => {
    const auth = await getAuthToken();
    token = auth.token;
  });

  it("should return 401 for GET /api/reports/sales without a token", async () => {
    const res = await request(app).get("/api/reports/sales?from=2023-01-01&to=2023-12-31");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 for GET /api/reports/sales with a token", async () => {
    const res = await request(app)
      .get(`/api/reports/sales?from=2024-01-01&to=${new Date().toISOString().split('T')[0]}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.report).toBeInstanceOf(Array);
  });

  it("should return 401 for GET /api/reports/popular-items without a token", async () => {
    const res = await request(app).get("/api/reports/popular-items");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 for GET /api/reports/popular-items with a token", async () => {
    const res = await request(app)
      .get("/api/reports/popular-items")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toBeInstanceOf(Array);
  });
});
