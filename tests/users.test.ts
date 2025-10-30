// FIX: Import Jest globals to resolve TypeScript errors.
import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app";

describe("User Auth Flow", () => {
  it("registers a new user", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ email: "test@coffee.com", password: "pass123" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("logs in the user", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "test@coffee.com", password: "pass123" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
