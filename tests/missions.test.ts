import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app";

describe("Missions Module (Protected Routes)", () => {
  it("should return 401 for GET /api/missions without a token", async () => {
    const res = await request(app).get("/api/missions");
    expect(res.statusCode).toBe(401);
  });

  it("should return 401 for POST /api/missions/:id/claim without a token", async () => {
    const res = await request(app)
      .post("/api/missions/m-1/claim");
    expect(res.statusCode).toBe(401);
  });
});
