import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { getAuthToken } from "./test-utils";

describe("Notifications Module (Protected)", () => {
  let token: string;

  beforeAll(async () => {
    const auth = await getAuthToken();
    token = auth.token;
  });

  it("should return 401 for POST /api/notifications/email without a token", async () => {
    const res = await request(app)
      .post("/api/notifications/email")
      .send({ to: "test@example.com", subject: "Hello", body: "World" });
    expect(res.statusCode).toBe(401);
  });

  it("should return 401 for POST /api/notifications/push without a token", async () => {
    const res = await request(app)
      .post("/api/notifications/push")
      .send({ userId: "user-1", title: "Hi", body: "There" });
    expect(res.statusCode).toBe(401);
  });

  it("should return 401 for GET /api/notifications/me without a token", async () => {
    const res = await request(app).get("/api/notifications/me");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 for GET /api/notifications/me with a token", async () => {
    const res = await request(app)
      .get("/api/notifications/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.notifications).toBeInstanceOf(Array);
  });
});
