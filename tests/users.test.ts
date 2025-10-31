import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app";

describe("User Auth Flow", () => {
  const userEmail = `testuser_${Date.now()}@coffee.com`;
  const userPassword = "pass123";

  it("registers a new user and returns a token", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ email: userEmail, password: userPassword, name: "Test User" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("logs in an existing user and returns a token", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: userEmail, password: userPassword });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
  
  it("should fail to get profile without a token", async () => {
    const res = await request(app).get("/api/users/profile");
    expect(res.statusCode).toBe(401);
  });

  it("should get user profile with a valid token", async () => {
    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ email: userEmail, password: userPassword });
    const freshToken = loginRes.body.token;

    const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${freshToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(userEmail);
  });

  it("should prevent registering a user with an existing email", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ email: userEmail, password: userPassword, name: "Another User" });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toEqual("User already exists");
  });
});
