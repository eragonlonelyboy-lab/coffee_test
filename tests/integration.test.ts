import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Integration smoke tests", () => {
  it("health check", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });

  it("list menu", async () => {
    const res = await request(app).get("/api/menu");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
  });
});
