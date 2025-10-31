import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app";

describe("Promotions Module", () => {
  it("should list active promotions publicly", async () => {
    const res = await request(app).get("/api/promotions");
    expect(res.statusCode).toBe(200);
    // Assuming the test DB is empty, we just check for an array
    expect(res.body.promotions).toBeInstanceOf(Array);
  });
});
